import { useCallback, useEffect, useMemo, useState } from "react";
import { api, formatNumber } from "../api/client.js";

function valueFor(row, column) {
  const value = row[column.key];
  if (value == null || value === "") return "—";
  if (column.format) return column.format(value, row);
  return Array.isArray(value) ? value.join(", ") : String(value);
}

function initialValues(fields, row) {
  return Object.fromEntries(fields.map(field => {
    const value = row?.[field.name];
    return [field.name, field.type === "ids" ? (value || []).join(", ") : value ?? field.defaultValue ?? ""];
  }));
}

function requestValues(fields, form) {
  const data = {};
  for (const field of fields) {
    const raw = form.get(field.name);
    if (field.type === "ids") data[field.name] = String(raw || "").split(",").map(v => Number(v.trim())).filter(Number.isFinite);
    else if (field.type === "number") data[field.name] = raw === "" ? null : Number(raw);
    else data[field.name] = raw === "" ? null : String(raw);
  }
  return data;
}

function Editor({ config, row, onClose, onSave }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const values = initialValues(config.fields, row);
  async function submit(event) {
    event.preventDefault();
    setBusy(true); setError("");
    const data = requestValues(config.fields, new FormData(event.currentTarget));
    try { await onSave(data); onClose(); }
    catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }
  return <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}><form className="editor" onSubmit={submit}>
    <div className="editor-head"><h2>{row ? "Cập nhật" : "Thêm mới"} · {config.title}</h2><button type="button" className="icon-button" onClick={onClose}>×</button></div>
    <div className="field-grid">{config.fields.map(field => <label className={field.wide ? "field wide" : "field"} key={field.name}><span>{field.label}</span>
      {field.options ? <select name={field.name} defaultValue={values[field.name]} required={field.required}>{field.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
        : field.multiline ? <textarea name={field.name} rows="4" defaultValue={values[field.name]} required={field.required} />
        : <input name={field.name} type={field.type === "ids" ? "text" : field.type || "text"} step={field.type === "number" ? "any" : undefined} defaultValue={values[field.name]} required={field.required} placeholder={field.placeholder || ""} />}
    </label>)}</div>
    {error && <p className="error-message">{error}</p>}
    <div className="editor-actions"><button type="button" className="button secondary" onClick={onClose}>Hủy</button><button className="button primary" disabled={busy}>{busy ? "Đang lưu…" : "Lưu"}</button></div>
  </form></div>;
}

export default function ResourcePage({ config }) {
  const [rows, setRows] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const [search, setSearch] = useState(""); const [editorRow, setEditorRow] = useState(undefined);
  const reload = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const data = await api.list(config.path);
      setRows(config.filter ? data.filter(config.filter) : data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [config]);
  useEffect(() => { reload(); }, [reload]);

  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase("vi");
    return rows.filter(row => !q || config.columns.map(col => valueFor(row, col)).join(" ").toLocaleLowerCase("vi").includes(q));
  }, [rows, search, config]);

  async function save(data) {
    if (editorRow) await api.update(config.updatePath(editorRow), data);
    else await api.create(config.createPath || config.path, data);
    await reload();
  }

  async function remove(row) {
    if (!window.confirm(`Xóa ${config.itemName} này?`)) return;
    try { await api.remove(config.deletePath(row)); await reload(); }
    catch (e) { setError(e.message); }
  }

  return <main className="content">
    <div className="page-title"><div><h1>{config.title}</h1><p>{config.description}</p></div>{config.fields?.length > 0 && <button className="button primary" onClick={() => setEditorRow(null)}>Thêm {config.itemName}</button>}</div>
    <section className="panel"><div className="toolbar"><input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder={`Tìm trong ${config.title.toLocaleLowerCase("vi")}…`} /><button className="button secondary" onClick={reload}>Tải lại</button><span>{loading ? "Đang tải…" : `${formatNumber(filtered.length)} bản ghi`}</span></div>
      {error && <div className="error-banner">{error}</div>}
      {loading ? <div className="empty-state">Đang tải dữ liệu từ backend…</div> : filtered.length === 0 ? <div className="empty-state">{error ? "Không tải được dữ liệu." : "API không có bản ghi phù hợp."}</div> : <div className="table-wrap"><table><thead><tr>{config.columns.map(col => <th key={col.key}>{col.label}</th>)}{(config.fields?.length || config.deletePath) && <th>Thao tác</th>}</tr></thead><tbody>{filtered.map((row, index) => <tr key={row[config.idKey] ?? index}>{config.columns.map(col => <td key={col.key}>{valueFor(row, col)}</td>)}{(config.fields?.length || config.deletePath) && <td><div className="row-actions">{config.fields?.length > 0 && config.allowEdit !== false && <button className="text-button" onClick={() => setEditorRow(row)}>Sửa</button>}{config.deletePath && <button className="text-button danger" onClick={() => remove(row)}>Xóa</button>}</div></td>}</tr>)}</tbody></table></div>}
    </section>
    {editorRow !== undefined && <Editor config={config} row={editorRow} onClose={() => setEditorRow(undefined)} onSave={save} />}
  </main>;
}
