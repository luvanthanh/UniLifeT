import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import OwnerLayout from './components/OwnerLayout';
import RequireOwner from './components/RequireOwner';
import { api, clearToken, getToken, saveToken } from './api/client';

const endpoints = {
  motels: { url: '/motels/me', id: 'motelId', title: 'Nhà trọ', fields: [
    ['motelName','Tên nhà trọ'], ['motelAddress','Địa chỉ'], ['motelOwner','Tên chủ trọ'], ['universityIds','ID trường (phân cách dấu phẩy)','ids']
  ] },
  rooms: { url: '/rooms/owner', id: 'roomId', title: 'Phòng trọ', fields: [
    ['motelId','Nhà trọ','select:motelId'], ['roomPrice','Giá thuê/tháng','number'], ['roomDeposit','Tiền cọc','number'], ['roomArea','Diện tích (m²)','number'], ['roomAddress','Địa chỉ phòng'], ['roomType','Loại phòng'], ['roomStatus','Trạng thái'], ['roomDescription','Mô tả'], ['serviceIds','ID dịch vụ (phân cách dấu phẩy)','ids']
  ] },
  posts: { url: '/posts/me', id: 'postId', title: 'Tin đăng', fields: [
    ['roomId','Phòng','select:roomId'], ['postTitle','Tiêu đề'], ['postContent','Nội dung','textarea'], ['postStatus','Trạng thái']
  ] },
};

function normalizeList(value) { if (Array.isArray(value)) return value; if (Array.isArray(value?.content)) return value.content; return []; }
function display(value) {
  if (value == null || value === '') return '—';
  if (Array.isArray(value)) return value.join(', ') || '—';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function Page({ title, subtitle, children }) {
  return <><header className="page-head"><div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div></header>{children}</>;
}

function Notice({ message, error, onClose }) {
  if (!message) return null;
  return <div className={`notice ${error ? 'error' : ''}`} role="status">{message}<button onClick={onClose} aria-label="Đóng">×</button></div>;
}

function LoginPage() {
  const [form, setForm] = useState({ userName: '', userPassword: '' });
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false); const navigate = useNavigate();
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const result = await api('/users/auth/login', { method: 'POST', body: form });
      if (!result?.token) throw new Error('Backend không trả về token đăng nhập.');
      saveToken(result.token);
      const me = await api('/users/me');
      if (String(me?.userRole || '').toUpperCase() !== 'OWNER') { clearToken(); throw new Error('Tài khoản này không có quyền chủ nhà trọ.'); }
      navigate('/', { replace: true });
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  return <main className="login-wrap"><form className="panel login" onSubmit={submit}><div className="brand login-brand">UniLifeT</div><h1>Đăng nhập chủ nhà trọ</h1><p>Đăng nhập bằng tài khoản có vai trò OWNER.</p>
    <label>Tên đăng nhập<input required autoComplete="username" value={form.userName} onChange={e => setForm({ ...form, userName: e.target.value })}/></label>
    <label>Mật khẩu<input type="password" required autoComplete="current-password" value={form.userPassword} onChange={e => setForm({ ...form, userPassword: e.target.value })}/></label>
    {error && <div className="form-error">{error}</div>}<button className="primary full" disabled={busy}>{busy ? 'Đang đăng nhập…' : 'Đăng nhập'}</button>
  </form></main>;
}

function useNotice() {
  const [notice, setNotice] = useState(null);
  const show = (message, error = false) => { setNotice({ message, error }); window.setTimeout(() => setNotice(null), 5000); };
  return [notice, show, () => setNotice(null)];
}

function DataPage({ resource }) {
  const config = endpoints[resource]; const [rows, setRows] = useState([]); const [lookups, setLookups] = useState({});
  const [loading, setLoading] = useState(true); const [editing, setEditing] = useState(null); const [busy, setBusy] = useState(false);
  const [notice, notify, clearNotice] = useNotice();
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api(config.url); setRows(normalizeList(data));
      if (resource === 'rooms' || resource === 'posts') {
        const motelData = await api('/motels/me').catch(() => []);
        const roomData = resource === 'posts' ? await api('/rooms/owner').catch(() => []) : [];
        setLookups({ motels: normalizeList(motelData), rooms: normalizeList(roomData) });
      }
    } catch (e) { notify(e.message, true); } finally { setLoading(false); }
  }, [config.url, resource]);
  useEffect(() => { load(); }, [load]);
  const columns = useMemo(() => [...new Set([config.id, ...config.fields.map(f => f[0])])], [config]);
  async function save(form) {
    setBusy(true);
    try {
      let body = { ...form };
      if (resource === 'motels') { const user = await api('/users/me'); body = { ...body, userId: user.userId, universityIds: body.universityIds || [] }; }
      if (resource === 'posts') { const user = await api('/users/me'); body = { ...body, userId: user.userId, postCreateAt: new Date().toISOString(), postView: editing?.postView || 0 }; }
      const updatePath = resource === 'rooms' ? `/rooms/update/${editing?.[config.id]}` : `/${resource}/${editing?.[config.id]}`;
      await api(editing?.[config.id] ? updatePath : `/${resource}`, { method: editing?.[config.id] ? 'PUT' : 'POST', body });
      notify(editing ? 'Đã cập nhật dữ liệu.' : 'Đã tạo dữ liệu.'); setEditing(null); await load();
    } catch (e) { notify(e.message, true); } finally { setBusy(false); }
  }
  async function remove(row) {
    if (!window.confirm(`Xóa ${config.title.toLowerCase()} này?`)) return;
    try { await api(`/${resource === 'motels' ? 'motels' : resource}/${row[config.id]}`, { method: 'DELETE' }); notify('Đã xóa.'); await load(); }
    catch (e) { notify(e.message, true); }
  }
  return <Page title={config.title} subtitle="Dữ liệu được tải trực tiếp từ backend.">
    <Notice message={notice?.message} error={notice?.error} onClose={clearNotice}/>
    <div className="toolbar"><span>{loading ? 'Đang tải…' : `${rows.length} mục`}</span><div><button className="secondary" onClick={load}>Tải lại</button><button className="primary" onClick={() => setEditing({})}>Thêm {config.title.toLowerCase()}</button></div></div>
    <div className="panel table-wrap"><table><thead><tr>{columns.map(c => <th key={c}>{labelFor(c)}</th>)}<th>Thao tác</th></tr></thead><tbody>
      {rows.map(row => <tr key={row[config.id]}>{columns.map(c => <td key={c}>{display(row[c])}</td>)}<td className="actions"><button className="link-button" onClick={() => setEditing(row)}>Sửa</button><button className="link-button danger-text" onClick={() => remove(row)}>Xóa</button></td></tr>)}
      {!loading && !rows.length && <tr><td className="empty" colSpan={columns.length + 1}>Chưa có dữ liệu.</td></tr>}
    </tbody></table></div>
    {editing && <ResourceForm config={config} initial={editing} lookups={lookups} busy={busy} onClose={() => setEditing(null)} onSave={save}/>}
  </Page>;
}

function labelFor(name) { return ({ motelId:'Nhà trọ', roomId:'Phòng', motelName:'Tên nhà trọ', motelAddress:'Địa chỉ', motelOwner:'Chủ trọ', roomPrice:'Giá thuê', roomDeposit:'Tiền cọc', roomArea:'Diện tích', roomAddress:'Địa chỉ', roomType:'Loại phòng', roomStatus:'Trạng thái', roomDescription:'Mô tả', serviceIds:'Dịch vụ', postTitle:'Tiêu đề', postContent:'Nội dung', postStatus:'Trạng thái', universityIds:'Trường đại học' })[name] || name; }

function ResourceForm({ config, initial, lookups, busy, onClose, onSave }) {
  const [form, setForm] = useState(() => Object.fromEntries(config.fields.map(([key,,kind]) => {
    let value = initial[key];
    if (kind === 'ids') value = Array.isArray(value) ? value.join(', ') : '';
    return [key, value ?? ''];
  })));
  function submit(event) {
    event.preventDefault();
    const body = {};
    for (const [key,,kind] of config.fields) {
      let value = form[key];
      if (kind === 'ids') value = value ? String(value).split(',').map(v => Number(v.trim())).filter(Number.isFinite) : [];
      else if (kind === 'number' || kind?.startsWith('select:')) value = value === '' ? null : Number(value);
      body[key] = value;
    }
    onSave(body);
  }
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}><form className="panel modal" onSubmit={submit}>
    <div className="modal-head"><h2>{initial[config.id] ? `Sửa ${config.title.toLowerCase()}` : `Thêm ${config.title.toLowerCase()}`}</h2><button type="button" className="icon-button" onClick={onClose}>×</button></div>
    {config.fields.map(([key,label,kind]) => <label key={key}>{label}
      {kind?.startsWith('select:') ? <select required value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}><option value="">Chọn</option>{(kind === 'select:motelId' ? lookups.motels : lookups.rooms).map(item => <option key={item[kind.slice(7)]} value={item[kind.slice(7)]}>{item.motelName || item.roomAddress || `#${item[kind.slice(7)]}`}</option>)}</select>
      : kind === 'textarea' ? <textarea rows="4" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}/>
      : <input type={kind === 'number' ? 'number' : 'text'} min={kind === 'number' ? '0' : undefined} step={kind === 'number' ? 'any' : undefined} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required={!['roomDeposit','roomArea','roomDescription','serviceIds','universityIds'].includes(key)}/>}</label>)}
    <div className="modal-actions"><button type="button" className="secondary" onClick={onClose}>Hủy</button><button className="primary" disabled={busy}>{busy ? 'Đang lưu…' : 'Lưu'}</button></div>
  </form></div>;
}

function useResource(url) {
  const [rows, setRows] = useState([]); const [reload, setReload] = useState(0); const [loading, setLoading] = useState(true); const [notice, notify, clear] = useNotice();
  useEffect(() => { let active = true; setLoading(true); api(url).then(data => active && setRows(normalizeList(data))).catch(e => active && notify(e.message, true)).finally(() => active && setLoading(false)); return () => { active = false; }; }, [url, reload]);
  return { rows, loading, notice, notify, clear, refresh: () => setReload(v => v + 1) };
}

function DashboardPage() {
  const [stats, setStats] = useState(null); const [error, setError] = useState('');
  useEffect(() => {
    Promise.all([api('/motels/me'), api('/rooms/owner'), api('/posts/me'), api('/rental-requests/owner'), api('/viewing-appointments/owner'), api('/user-room/owner')])
      .then(values => setStats(values.map(normalizeList))).catch(e => setError(e.message));
  }, []);
  const titles = ['Nhà trọ', 'Phòng', 'Tin đăng', 'Yêu cầu thuê', 'Lịch xem phòng', 'Hợp đồng thuê'];
  return <Page title="Tổng quan" subtitle="Tóm tắt dữ liệu quản lý từ backend.">{error && <div className="form-error">{error}</div>}
    {!stats ? <p className="muted">Đang tải dữ liệu…</p> : <div className="cards">{stats.map((rows,i) => <article className="panel stat-card" key={titles[i]}><span>{titles[i]}</span><strong>{rows.length}</strong></article>)}</div>}
    <section className="panel info-panel"><h2>Công việc chủ nhà trọ</h2><p>Quản lý thông tin nhà trọ, phòng và tin đăng; xử lý yêu cầu thuê, lịch xem phòng và theo dõi hợp đồng đang có.</p></section>
  </Page>;
}

function RequestsPage({ appointments = false }) {
  const url = appointments ? '/viewing-appointments/owner' : '/rental-requests/owner';
  const { rows, loading, notice, notify, clear, refresh } = useResource(url);
  async function update(row, status) {
    try {
      let body = { status };
      if (appointments && status === 'CONFIRMED') {
        const chosen = window.prompt('Nhập ngày giờ xem phòng (YYYY-MM-DDTHH:mm)', row.scheduledAt || '');
        if (!chosen) return;
        body.scheduledAt = chosen;
      }
      await api(appointments ? `/viewing-appointments/${row.appointmentId}/status` : `/rental-requests/${row.rentalRequestId}/status`, { method: 'PATCH', body });
      notify('Đã cập nhật trạng thái.'); refresh();
    } catch (e) { notify(e.message, true); }
  }
  const fields = appointments ? ['appointmentId','studentName','studentPhone','roomId','requestedAt','scheduledAt','status','message'] : ['rentalRequestId','studentName','studentPhone','roomId','requestedStartDate','requestedRent','status','message'];
  return <Page title={appointments ? 'Lịch xem phòng' : 'Yêu cầu thuê'} subtitle="Xem thông tin và cập nhật trạng thái qua API backend.">
    <Notice message={notice?.message} error={notice?.error} onClose={clear}/><div className="toolbar"><span>{loading ? 'Đang tải…' : `${rows.length} mục`}</span><button className="secondary" onClick={refresh}>Tải lại</button></div>
    <div className="panel table-wrap"><table><thead><tr>{fields.map(c => <th key={c}>{labelFor(c)}</th>)}<th>Thao tác</th></tr></thead><tbody>
      {rows.map(row => <tr key={appointments ? row.appointmentId : row.rentalRequestId}>{fields.map(key => <td key={key}>{display(row[key])}</td>)}<td className="actions">
        {(!appointments && row.status === 'PENDING') && <><button className="link-button" onClick={() => update(row,'ACCEPTED')}>Chấp nhận</button><button className="link-button danger-text" onClick={() => update(row,'REJECTED')}>Từ chối</button></>}
        {appointments && row.status === 'PENDING' && <><button className="link-button" onClick={() => update(row,'CONFIRMED')}>Xác nhận</button><button className="link-button danger-text" onClick={() => update(row,'REJECTED')}>Từ chối</button></>}
        {appointments && row.status === 'CONFIRMED' && <button className="link-button" onClick={() => update(row,'COMPLETED')}>Hoàn tất</button>}
        {(!appointments && row.status !== 'PENDING') || (appointments && !['PENDING','CONFIRMED'].includes(row.status)) ? '—' : null}
      </td></tr>)}
      {!loading && !rows.length && <tr><td colSpan={fields.length + 1} className="empty">Chưa có dữ liệu.</td></tr>}
    </tbody></table></div>
  </Page>;
}

function TenantsPage() {
  const { rows, loading, notice, notify, clear, refresh } = useResource('/user-room/owner');
  async function end(row) { if (!window.confirm('Kết thúc hợp đồng thuê này?')) return; try { await api(`/user-room/${row.userRoomId}/end`, { method: 'PATCH' }); notify('Đã kết thúc hợp đồng.'); refresh(); } catch (e) { notify(e.message,true); } }
  const fields = ['userRoomId','userName','userPhone','roomId','startDate','endDate','monthlyRent','contractStatus'];
  return <Page title="Người thuê và hợp đồng" subtitle="Danh sách hợp đồng gắn với các phòng của bạn."><Notice message={notice?.message} error={notice?.error} onClose={clear}/>
    <div className="toolbar"><span>{loading ? 'Đang tải…' : `${rows.length} hợp đồng`}</span><button className="secondary" onClick={refresh}>Tải lại</button></div>
    <div className="panel table-wrap"><table><thead><tr>{fields.map(c => <th key={c}>{labelFor(c)}</th>)}<th>Thao tác</th></tr></thead><tbody>{rows.map(row => <tr key={row.userRoomId}>{fields.map(c => <td key={c}>{display(row[c])}</td>)}<td>{row.contractStatus === 'ACTIVE' ? <button className="link-button danger-text" onClick={() => end(row)}>Kết thúc hợp đồng</button> : '—'}</td></tr>)}{!loading && !rows.length && <tr><td className="empty" colSpan={fields.length + 1}>Chưa có hợp đồng.</td></tr>}</tbody></table></div>
  </Page>;
}

function AmenitiesPage() {
  const { rows: rooms, loading } = useResource('/rooms/owner'); const [amenities, setAmenities] = useState([]); const [roomId, setRoomId] = useState(''); const [items,setItems] = useState([]); const [amenityId,setAmenityId] = useState(''); const [quantity,setQuantity] = useState('1'); const [notice,notify,clear] = useNotice();
  useEffect(() => { api('/amenities').then(v => setAmenities(normalizeList(v))).catch(e => notify(e.message,true)); }, []);
  const load = useCallback(async () => { if (!roomId) { setItems([]); return; } try { setItems(normalizeList(await api(`/room-amenity/get-room-amenity/${roomId}`))); } catch(e) { notify(e.message,true); } }, [roomId]);
  useEffect(() => { load(); }, [load]);
  async function add(e) { e.preventDefault(); try { await api('/room-amenity',{method:'POST',body:{roomId:Number(roomId),amenityId:Number(amenityId),amenityQuantity:Number(quantity)}}); notify('Đã thêm tiện nghi.'); load(); } catch(e) { notify(e.message,true); } }
  async function remove(id) { try { await api(`/room-amenity/${id}`,{method:'DELETE'}); notify('Đã xóa tiện nghi.'); load(); } catch(e) { notify(e.message,true); } }
  return <Page title="Tiện nghi phòng" subtitle="Gán hoặc gỡ tiện nghi cho phòng qua các API hiện có."><Notice message={notice?.message} error={notice?.error} onClose={clear}/>
    <div className="panel form-panel"><label>Chọn phòng<select value={roomId} onChange={e=>setRoomId(e.target.value)}><option value="">Chọn phòng</option>{rooms.map(r=><option key={r.roomId} value={r.roomId}>#{r.roomId} · {r.roomAddress}</option>)}</select></label>
      {roomId && <><form className="inline-form" onSubmit={add}><select required value={amenityId} onChange={e=>setAmenityId(e.target.value)}><option value="">Chọn tiện nghi</option>{amenities.map(a=><option key={a.amenityId} value={a.amenityId}>{a.amenityName}</option>)}</select><input aria-label="Số lượng" type="number" min="1" value={quantity} onChange={e=>setQuantity(e.target.value)}/><button className="primary">Thêm</button></form>
      <div className="simple-list">{items.map(item=><div key={item.roomAmenityId}><span>{amenities.find(a=>a.amenityId===item.amenityId)?.amenityName || `Tiện nghi #${item.amenityId}`} · SL {item.amenityQuantity}</span><button className="link-button danger-text" onClick={()=>remove(item.roomAmenityId)}>Xóa</button></div>)}{!items.length && <p className="muted">Phòng chưa có tiện nghi.</p>}</div></>}
      {loading && <p className="muted">Đang tải danh sách phòng…</p>}
    </div>
  </Page>;
}

function ImagesPage() {
  const { rows: motels } = useResource('/motels/me'); const { rows: rooms } = useResource('/rooms/owner'); const [target,setTarget] = useState('room'); const [parentId,setParentId] = useState(''); const [items,setItems] = useState([]); const [name,setName] = useState(''); const [url,setUrl] = useState(''); const [notice,notify,clear] = useNotice();
  const load = useCallback(async () => { if (!parentId) {setItems([]);return;} const resource=target==='room'?'room-images':'motel-images'; const segment=target==='room'?'room':'motel'; try { setItems(normalizeList(await api(`/${resource}/get-${segment}-image/${parentId}`))); } catch(e) { notify(e.message,true); } },[target,parentId]);
  useEffect(()=>{load();},[load]);
  async function add(e) {e.preventDefault(); const body=target==='room'?{roomId:Number(parentId),imageName:name,imageUrl:url}:{motelId:Number(parentId),imageName:name,imageUrl:url}; try {await api(target==='room'?'/room-images':'/motel-images',{method:'POST',body});notify('Đã thêm ảnh.');setName('');setUrl('');load();}catch(e){notify(e.message,true);}}
  async function remove(item) {if(!window.confirm('Xóa ảnh này?'))return;try{await api(`/${target==='room'?'room-images':'motel-images'}/${item.imageId}`,{method:'DELETE'});notify('Đã xóa ảnh.');load();}catch(e){notify(e.message,true);}}
  return <Page title="Hình ảnh" subtitle="Lưu URL ảnh cho nhà trọ hoặc phòng; backend hiện nhận đường dẫn ảnh."><Notice message={notice?.message} error={notice?.error} onClose={clear}/>
    <div className="panel form-panel"><div className="inline-form"><select value={target} onChange={e=>{setTarget(e.target.value);setParentId('');}}><option value="room">Ảnh phòng</option><option value="motel">Ảnh nhà trọ</option></select><select value={parentId} onChange={e=>setParentId(e.target.value)}><option value="">Chọn {target==='room'?'phòng':'nhà trọ'}</option>{(target==='room'?rooms:motels).map(x=><option value={x[target==='room'?'roomId':'motelId']} key={x[target==='room'?'roomId':'motelId']}>#{x[target==='room'?'roomId':'motelId']} · {x.roomAddress||x.motelName}</option>)}</select></div>
    {parentId && <><form className="inline-form" onSubmit={add}><input required placeholder="Tên ảnh" value={name} onChange={e=>setName(e.target.value)}/><input required type="url" placeholder="https://..." value={url} onChange={e=>setUrl(e.target.value)}/><button className="primary">Thêm URL ảnh</button></form><div className="image-grid">{items.map(item=><article className="panel image-item" key={item.imageId}><img src={item.imageUrl} alt={item.imageName} loading="lazy"/><div>{item.imageName}<button className="link-button danger-text" onClick={()=>remove(item)}>Xóa</button></div></article>)}{!items.length&&<p className="muted">Chưa có ảnh.</p>}</div></>}</div>
  </Page>;
}

function ProfilePage() {
  const [user,setUser] = useState(null); const [error,setError] = useState('');
  useEffect(()=>{api('/users/me').then(setUser).catch(e=>setError(e.message));},[]);
  return <Page title="Tài khoản" subtitle="Thông tin tài khoản lấy từ API /users/me.">{error&&<div className="form-error">{error}</div>}{user&&<div className="panel profile-grid">{Object.entries(user).map(([key,value])=><div key={key}><span>{labelFor(key)}</span><strong>{display(value)}</strong></div>)}</div>}</Page>;
}

function StatisticsPage() {
  const [rows,setRows]=useState(null); const [error,setError]=useState('');
  useEffect(()=>{Promise.all([api('/motels/me'),api('/rooms/owner'),api('/posts/me'),api('/rental-requests/owner'),api('/user-room/owner')]).then(d=>setRows(d.map(normalizeList))).catch(e=>setError(e.message));},[]);
  const labels=['Nhà trọ','Phòng','Tin đăng','Yêu cầu thuê','Hợp đồng'];
  return <Page title="Thống kê" subtitle="Các con số được tính từ danh sách do backend trả về, không dùng dữ liệu mẫu.">{error&&<div className="form-error">{error}</div>}{rows?<div className="cards">{rows.map((v,i)=><article key={labels[i]} className="panel stat-card"><span>{labels[i]}</span><strong>{v.length}</strong></article>)}</div>:<p className="muted">Đang tải…</p>}</Page>;
}

export default function App() {
  return <Routes>
    <Route path="/login" element={getToken() ? <Navigate to="/" replace/> : <LoginPage/>}/>
    <Route element={<RequireOwner/>}><Route element={<OwnerLayout/>}>
      <Route index element={<DashboardPage/>}/><Route path="motels" element={<DataPage resource="motels"/>}/><Route path="rooms" element={<DataPage resource="rooms"/>}/><Route path="posts" element={<DataPage resource="posts"/>}/>
      <Route path="rental-requests" element={<RequestsPage/>}/><Route path="appointments" element={<RequestsPage appointments/>}/><Route path="tenants" element={<TenantsPage/>}/><Route path="amenities" element={<AmenitiesPage/>}/><Route path="images" element={<ImagesPage/>}/><Route path="statistics" element={<StatisticsPage/>}/><Route path="profile" element={<ProfilePage/>}/>
    </Route></Route>
    <Route path="*" element={<Navigate to={getToken()?'/':'/login'} replace/>}/>
  </Routes>;
}
