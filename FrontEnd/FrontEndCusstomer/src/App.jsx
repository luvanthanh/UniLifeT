import { createContext, useContext, useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { api, clearSession, getRole, getToken, imageUrl, money } from "./api/client.js";

const SessionContext = createContext(null);
const useSession = () => useContext(SessionContext);
const fallback = (error, setError) => setError(error?.message || "Không tải được dữ liệu từ backend.");
const available = (room) => /available|open|còn trống|còn phòng/i.test(room.roomStatus || "");

function App() {
  const [token, setToken] = useState(getToken());
  const role = getRole(token);
  const signOut = () => { clearSession(); setToken(null); };
  return <SessionContext.Provider value={{ token, role, setToken, signOut }}>
    <div className="app-shell"><Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/:roomId" element={<RoomDetail />} />
        <Route path="/favorites" element={<RequireStudent><Favorites /></RequireStudent>} />
        <Route path="/rentals" element={<RequireStudent><Rentals /></RequireStudent>} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<main className="container page"><h1>Không tìm thấy trang</h1><Link to="/">Về trang chủ</Link></main>} />
      </Routes>
      <footer className="footer"><div className="container">UniLifeT · Dữ liệu phòng trọ được tải từ backend.</div></footer>
    </div>
  </SessionContext.Provider>;
}

function Header() {
  const { token, signOut } = useSession();
  return <header className="topbar"><div className="container nav">
    <Link className="brand" to="/">UniLife<span>T</span></Link>
    <nav><Link to="/rooms">Tìm phòng</Link>{token && <><Link to="/favorites">Đã lưu</Link><Link to="/rentals">Yêu cầu thuê</Link><Link to="/profile">Tài khoản</Link></>}</nav>
    {token ? <button className="button button-light" onClick={signOut}>Đăng xuất</button> : <Link className="button button-dark" to="/login">Đăng nhập</Link>}
  </div></header>;
}

function PageState({ loading, error, empty, children }) {
  if (loading) return <div className="state"><span className="spinner" />Đang tải dữ liệu từ UniLifeT…</div>;
  if (error) return <div className="state state-error"><strong>Không tải được dữ liệu</strong><span>{error}</span><button className="button button-light" onClick={() => window.location.reload()}>Thử lại</button></div>;
  if (empty) return <div className="state">{empty}</div>;
  return children;
}

function Home() {
  const { token, role } = useSession();
  const [rooms, setRooms] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]); const [favoritesLoading, setFavoritesLoading] = useState(false); const [favoritesError, setFavoritesError] = useState("");
  useEffect(() => { api.rooms().then(setRooms).catch(e => fallback(e, setError)).finally(() => setLoading(false)); }, []);
  useEffect(() => {
    if (!token || role !== "STUDENT") {
      setFavorites([]);
      setFavoritesLoading(false);
      setFavoritesError("");
      return;
    }
    setFavoritesLoading(true);
    api.favorites().then(setFavorites).catch(e => fallback(e, setFavoritesError)).finally(() => setFavoritesLoading(false));
  }, [token, role]);
  const featured = rooms.filter(available).slice(0, 6);
  return <><main>
    <section className="hero"><div className="container hero-inner"><p className="eyebrow">UNI LIFET · TÌM PHÒNG GẦN TRƯỜNG</p><h1>Tìm nơi ở phù hợp<br />cho cuộc sống sinh viên.</h1><p className="hero-copy">Khám phá phòng trọ và gửi yêu cầu thuê trực tiếp trên UniLifeT.</p><SearchForm /><Link className="button button-dark hero-link" to="/rooms">Xem tất cả phòng <span>→</span></Link></div></section>
    <section className="container section favorite-section"><div className="section-heading"><div><p className="eyebrow">DÀNH CHO BẠN</p><h2>Lịch sử phòng yêu thích</h2></div>{token && role === "STUDENT" && favorites.length > 0 && <Link to="/favorites">Xem tất cả →</Link>}</div>
      {!token ? <div className="favorite-prompt"><span>Đăng nhập bằng tài khoản sinh viên để xem các phòng bạn đã lưu.</span><Link className="button button-light" to="/login">Đăng nhập</Link></div>
        : role !== "STUDENT" ? <div className="state">Lịch sử yêu thích chỉ có ở tài khoản STUDENT.</div>
        : <PageState loading={favoritesLoading} error={favoritesError} empty={!favoritesLoading && !favoritesError && !favorites.length ? "Bạn chưa lưu phòng yêu thích nào." : ""}><div className="favorite-history-list">{favorites.slice(0, 4).map(item => <Link className="favorite-history-card" to={`/rooms/${item.roomId}`} key={item.roomId}><span className="favorite-heart">♥</span><span className="favorite-history-info"><strong>{item.roomType || `Phòng ${item.roomId}`}</strong><span>{item.motelName || "Nhà trọ"} · {item.roomAddress || "Chưa có địa chỉ"}</span><small>Đã lưu {item.createdAt ? new Date(item.createdAt).toLocaleString("vi-VN") : ""}</small></span><span className="favorite-arrow">→</span></Link>)}</div></PageState>}
    </section>
    <section className="container section"><div className="section-heading"><div><p className="eyebrow">DỮ LIỆU TỪ UNI LIFET</p><h2>Phòng còn trống</h2></div><Link to="/rooms">Khám phá tất cả →</Link></div>
      <PageState loading={loading} error={error} empty={!loading && !error && !featured.length ? "Backend hiện chưa có phòng còn trống." : ""}><RoomGrid rooms={featured} /></PageState>
    </section>
  </main></>;
}

function SearchForm({ initial = "" }) {
  const [query, setQuery] = useState(initial); const [maxPrice, setMaxPrice] = useState("");
  const navigate = useNavigate();
  const submit = (event) => { event.preventDefault(); const p = new URLSearchParams(); if (query.trim()) p.set("q", query.trim()); if (maxPrice) p.set("maxPrice", maxPrice); navigate(`/rooms${p.size ? `?${p}` : ""}`); };
  return <form className="search-form" onSubmit={submit}><label><span>Khu vực hoặc địa chỉ</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Nhập khu vực, địa chỉ…" /></label><label><span>Giá tối đa / tháng</span><input type="number" min="0" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Không giới hạn" /></label><button className="button button-dark">Tìm phòng</button></form>;
}

function Rooms() {
  const [rooms, setRooms] = useState([]); const [motels, setMotels] = useState([]); const [universities, setUniversities] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const [query, setQuery] = useState(new URLSearchParams(location.search).get("q") || ""); const [maxPrice, setMaxPrice] = useState(new URLSearchParams(location.search).get("maxPrice") || ""); const [sort, setSort] = useState("newest"); const [page, setPage] = useState(1);
  const [universityId, setUniversityId] = useState(""); const [minArea, setMinArea] = useState(""); const [maxArea, setMaxArea] = useState("");
  useEffect(() => { Promise.all([api.rooms(), api.motels(), api.universities()]).then(([r, m, u]) => { setRooms(r); setMotels(m); setUniversities(u); }).catch(e => fallback(e, setError)).finally(() => setLoading(false)); }, []);
  const filtered = rooms.filter(room => {
    const motel = motels.find(m => String(m.motelId) === String(room.motelId));
    const words = [room.roomType, room.roomAddress, room.roomDescription, motel?.motelName, motel?.motelAddress].filter(Boolean).join(" ").toLocaleLowerCase("vi");
    const universityMatch = !universityId || (motel?.universityIds || []).some(id => String(id) === universityId);
    return (!query || words.includes(query.toLocaleLowerCase("vi"))) && (!maxPrice || Number(room.roomPrice) <= Number(maxPrice))
      && (!minArea || Number(room.roomArea) >= Number(minArea)) && (!maxArea || Number(room.roomArea) <= Number(maxArea)) && universityMatch;
  });
  const sorted = [...filtered].sort((a,b) => sort === "cheap" ? Number(a.roomPrice)-Number(b.roomPrice) : sort === "expensive" ? Number(b.roomPrice)-Number(a.roomPrice) : Number(b.roomId)-Number(a.roomId));
  const visible = sorted.slice((page-1)*12, page*12);
  return <main className="container page"><div className="page-heading"><div><p className="eyebrow">KHÁM PHÁ</p><h1>Tìm phòng trọ</h1></div><span className="result-count">{loading ? "…" : `${filtered.length} phòng`}</span></div>
    <form className="filter-bar" onSubmit={e => { e.preventDefault(); setPage(1); }}><label><span>Từ khóa</span><input value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} placeholder="Tên phòng, khu vực, địa chỉ" /></label><label><span>Giá tối đa / tháng</span><input type="number" min="0" value={maxPrice} onChange={e => { setMaxPrice(e.target.value); setPage(1); }} placeholder="Không giới hạn" /></label><label><span>Diện tích từ (m²)</span><input type="number" min="0" value={minArea} onChange={e => { setMinArea(e.target.value); setPage(1); }} placeholder="Không giới hạn" /></label><label><span>Đến (m²)</span><input type="number" min="0" value={maxArea} onChange={e => { setMaxArea(e.target.value); setPage(1); }} placeholder="Không giới hạn" /></label><label><span>Trường đại học</span><select value={universityId} onChange={e => { setUniversityId(e.target.value); setPage(1); }}><option value="">Tất cả trường</option>{universities.map(u=><option key={u.universityId} value={u.universityId}>{u.universityName}</option>)}</select></label><label><span>Sắp xếp</span><select value={sort} onChange={e => setSort(e.target.value)}><option value="newest">Mới nhất</option><option value="cheap">Giá thấp trước</option><option value="expensive">Giá cao trước</option></select></label></form>
    <PageState loading={loading} error={error} empty={!loading && !error && !visible.length ? "Không tìm thấy phòng phù hợp." : ""}><RoomGrid rooms={visible} /><div className="pagination"><button className="button button-light" disabled={page===1} onClick={()=>setPage(page-1)}>Trước</button><span>Trang {page} / {Math.max(1, Math.ceil(filtered.length/12))}</span><button className="button button-light" disabled={page*12>=filtered.length} onClick={()=>setPage(page+1)}>Tiếp</button></div></PageState>
  </main>;
}

function RoomGrid({ rooms }) {
  return <div className="room-grid">{rooms.map(room => <RoomCard room={room} key={room.roomId} />)}</div>;
}

function RoomCard({ room }) {
  const [image, setImage] = useState(""); const [motel, setMotel] = useState(null);
  useEffect(() => { let active = true; Promise.all([api.roomImages(room.roomId), api.motels()]).then(([images, motels]) => { if (!active) return; setImage(imageUrl(images?.[0]?.imageUrl)); setMotel(motels.find(m => String(m.motelId)===String(room.motelId)) || null); }).catch(() => {}); return () => { active = false; }; }, [room.roomId, room.motelId]);
  return <article className="room-card"><Link className="room-image" to={`/rooms/${room.roomId}`}>{image ? <img src={image} alt={room.roomType || "Phòng trọ"} loading="lazy" /> : <span>Chưa có hình ảnh</span>}<span className={`badge ${available(room) ? "badge-open" : ""}`}>{room.roomStatus || "Chưa rõ trạng thái"}</span></Link><div className="room-info"><p className="muted">{motel?.motelName || "Nhà trọ"}</p><Link className="room-name" to={`/rooms/${room.roomId}`}>{room.roomType || room.roomDescription || `Phòng ${room.roomId}`}</Link><p className="muted">{room.roomAddress || motel?.motelAddress || "API chưa cung cấp địa chỉ"}</p><div className="room-card-bottom"><strong>{money(room.roomPrice)}<small> / tháng</small></strong><span>{room.roomArea ? `${room.roomArea} m²` : ""}</span></div></div></article>;
}

function RoomDetail() {
  const { roomId } = useParams(); const { token, role } = useSession(); const navigate = useNavigate(); const [room, setRoom] = useState(null); const [motel, setMotel] = useState(null); const [images, setImages] = useState([]); const [services, setServices] = useState([]); const [roomAmenities, setRoomAmenities] = useState([]); const [amenities, setAmenities] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [message, setMessage] = useState("");
  useEffect(() => {
    let active = true;
    async function loadRoomDetail() {
      const results = await Promise.allSettled([
        api.room(roomId), api.motels(), api.roomImages(roomId),
        api.services(), api.roomAmenities(roomId), api.amenities()
      ]);
      if (!active) return;
      const requiredError = results.slice(0, 3).find(result => result.status === "rejected");
      if (requiredError) {
        fallback(requiredError.reason, setError);
        setLoading(false);
        return;
      }
      const [roomResult, motelResult, imageResult, serviceResult, roomAmenityResult, amenityResult] = results;
      const loadedRoom = roomResult.value;
      setRoom(loadedRoom);
      setMotel(motelResult.value.find(item => String(item.motelId) === String(loadedRoom.motelId)) || null);
      setImages(imageResult.value || []);
      if (serviceResult.status === "fulfilled") setServices(serviceResult.value || []);
      if (roomAmenityResult.status === "fulfilled") setRoomAmenities(roomAmenityResult.value || []);
      if (amenityResult.status === "fulfilled") setAmenities(amenityResult.value || []);
      setLoading(false);
    }
    loadRoomDetail();
    return () => { active = false; };
  }, [roomId]);
  const act = async (action) => { if (!token) { navigate("/login", { state: { from: `/rooms/${roomId}` } }); return; } if (role !== "STUDENT") { setMessage("Chức năng này chỉ dành cho tài khoản STUDENT."); return; } try { await action(); setMessage("Đã gửi yêu cầu thành công."); } catch(e) { setMessage(e.message); } };
  const roomServices = services.filter(service => (room?.serviceIds || []).some(id => String(id) === String(service.serviceId)));
  const roomAmenityItems = roomAmenities.filter(item => String(item.roomId) === String(roomId));
  return <main className="container page"><PageState loading={loading} error={error} empty={!loading&&!error&&!room?"Không tìm thấy phòng.":""}>{room && <><Link className="back-link" to="/rooms">← Danh sách phòng</Link><div className="detail-layout"><section><div className="detail-image">{imageUrl(images?.[0]?.imageUrl) ? <img src={imageUrl(images[0].imageUrl)} alt={room.roomType || "Phòng trọ"} /> : <span>Backend chưa có ảnh phòng</span>}</div><div className="detail-copy"><p className="eyebrow">{motel?.motelName || "Nhà trọ"}</p><h1>{room.roomType || room.roomDescription || `Phòng ${room.roomId}`}</h1><p className="muted">{room.roomAddress || motel?.motelAddress}</p><p>{room.roomDescription}</p><div className="detail-facts"><span>Diện tích <b>{room.roomArea ? `${room.roomArea} m²` : "Chưa cập nhật"}</b></span><span>Tiền cọc <b>{money(room.roomDeposit)}</b></span><span>Tình trạng <b>{room.roomStatus}</b></span></div>
      <div className="detail-extra"><section><h2>Dịch vụ</h2>{roomServices.length ? <ul>{roomServices.map(service=><li key={service.serviceId}><span>{service.serviceName}</span><span>{service.servicePrice != null ? money(service.servicePrice) : ""}</span></li>)}</ul> : <p className="muted">Phòng chưa có dịch vụ được cập nhật.</p>}</section>
        <section><h2>Tiện nghi</h2>{roomAmenityItems.length ? <ul>{roomAmenityItems.map(item=>{const amenity=amenities.find(value=>String(value.amenityId)===String(item.amenityId));return <li key={item.roomAmenityId}><span>{amenity?.amenityName || `Tiện nghi #${item.amenityId}`}</span>{item.amenityQuantity>1&&<span>Số lượng: {item.amenityQuantity}</span>}</li>;})}</ul> : <p className="muted">Phòng chưa có tiện nghi được cập nhật.</p>}</section></div>
      </div></section><aside className="action-panel"><strong className="detail-price">{money(room.roomPrice)}<small> / tháng</small></strong><button className="button button-dark full" onClick={()=>act(()=>api.requestRental({roomId:Number(roomId),requestedStartDate:new Date().toISOString().slice(0,10)}))}>Gửi yêu cầu thuê</button><button className="button button-light full" onClick={()=>act(()=>api.requestViewing({roomId:Number(roomId),requestedAt:new Date(Date.now()+86400000).toISOString().slice(0,19)}))}>Hẹn xem phòng</button><button className="button button-light full" onClick={()=>act(()=>api.addFavorite(Number(roomId)))}>Lưu phòng yêu thích</button>{!token&&<p className="muted">Đăng nhập để gửi yêu cầu thuê, hẹn xem hoặc lưu phòng.</p>}{message&&<p className="inline-message">{message}</p>}</aside></div></>}</PageState></main>;
}

function RequireAuth({ children }) {
  const { token } = useSession(); const location = useLocation();
  return token ? children : <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
}

function RequireStudent({ children }) {
  const { token, role } = useSession();
  const location = useLocation();
  if (!token) return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
  if (role !== "STUDENT") return <main className="container page"><div className="state state-error"><strong>Chức năng dành cho tài khoản sinh viên</strong><span>Tài khoản hiện tại không có quyền STUDENT. Hãy đăng nhập bằng tài khoản sinh viên để xem phòng yêu thích hoặc yêu cầu thuê.</span></div></main>;
  return children;
}

function Favorites() {
  const [rooms, setRooms] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const reload = () => { setLoading(true); api.favorites().then(setRooms).catch(e=>fallback(e,setError)).finally(()=>setLoading(false)); };
  useEffect(reload, []);
  const remove = async (id) => { try { await api.removeFavorite(id); reload(); } catch(e) { setError(e.message); } };
  return <RequireAuth><main className="container page"><div className="page-heading"><div><p className="eyebrow">CÁ NHÂN</p><h1>Phòng đã lưu</h1></div></div><PageState loading={loading} error={error} empty={!loading&&!error&&!rooms.length?"Bạn chưa lưu phòng nào.":""}><div className="saved-list">{rooms.map(room=><article className="saved-row" key={room.roomId}><div><Link to={`/rooms/${room.roomId}`} className="room-name">{room.roomType || `Phòng ${room.roomId}`}</Link><p className="muted">{room.motelName} · {room.roomAddress}</p></div><button className="button button-light" onClick={()=>remove(room.roomId)}>Bỏ lưu</button></article>)}</div></PageState></main></RequireAuth>;
}

function Rentals() {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(()=>{api.rentals().then(setItems).catch(e=>fallback(e,setError)).finally(()=>setLoading(false));},[]);
  return <RequireAuth><main className="container page"><div className="page-heading"><div><p className="eyebrow">CÁ NHÂN</p><h1>Yêu cầu thuê của tôi</h1></div></div><PageState loading={loading} error={error} empty={!loading&&!error&&!items.length?"Bạn chưa gửi yêu cầu thuê nào.":""}><div className="saved-list">{items.map(item=><article className="saved-row" key={item.rentalRequestId}><div><Link className="room-name" to={`/rooms/${item.roomId}`}>Phòng #{item.roomId}</Link><p className="muted">Ngày bắt đầu: {item.requestedStartDate} · {money(item.requestedRent)} / tháng</p></div><span className="badge badge-open">{item.status}</span></article>)}</div></PageState></main></RequireAuth>;
}

function Profile() {
  const [user,setUser] = useState(null); const [loading,setLoading] = useState(true); const [error,setError] = useState(""); const [saved,setSaved] = useState(false);
  useEffect(()=>{api.me().then(setUser).catch(e=>fallback(e,setError)).finally(()=>setLoading(false));},[]);
  const submit=async e=>{e.preventDefault();setError("");setSaved(false);const form=new FormData(e.currentTarget);try{setUser(await api.updateMe({userName:form.get("userName"),userEmail:form.get("userEmail"),userPhone:form.get("userPhone"),userAddress:form.get("userAddress"),userGender:form.get("userGender"),userBirthday:form.get("userBirthday")||null}));setSaved(true);}catch(err){setError(err.message);}};
  return <RequireAuth><main className="container page narrow"><p className="eyebrow">CÁ NHÂN</p><h1>Hồ sơ của tôi</h1><PageState loading={loading} error={error&&!user?error:""}>{user&&<form className="form-card" onSubmit={submit}><Field label="Tên người dùng" name="userName" defaultValue={user.userName}/><Field label="Email" name="userEmail" type="email" defaultValue={user.userEmail}/><Field label="Số điện thoại" name="userPhone" defaultValue={user.userPhone}/><Field label="Địa chỉ" name="userAddress" defaultValue={user.userAddress}/><Field label="Ngày sinh" name="userBirthday" type="date" defaultValue={user.userBirthday}/><label className="field"><span>Giới tính</span><input name="userGender" defaultValue={user.userGender}/></label><button className="button button-dark">Lưu thay đổi</button>{saved&&<p className="success">Đã cập nhật hồ sơ.</p>}{error&&<p className="error-text">{error}</p>}</form>}</PageState></main></RequireAuth>;
}

function Field({ label, name, type="text", defaultValue }) { return <label className="field"><span>{label}</span><input name={name} type={type} defaultValue={defaultValue || ""} /></label>; }

function Login() {
  const {setToken}=useSession();const navigate=useNavigate();const location=useLocation();const [error,setError]=useState("");const [busy,setBusy]=useState(false);
  const submit=async e=>{e.preventDefault();setBusy(true);setError("");const f=new FormData(e.currentTarget);const userName=String(f.get("userName")).trim();try{const result=await api.login({userName,userPassword:f.get("userPassword")});if(!result?.token)throw new Error("Backend không trả về token đăng nhập.");localStorage.setItem("unitlife.token",result.token);localStorage.setItem("unitlife.userId",String(result.userId));localStorage.setItem("unitlife.userName",userName);setToken(result.token);navigate(location.state?.from||"/",{replace:true});}catch(err){setError(err.message);}finally{setBusy(false);}};
  return <main className="container page narrow"><p className="eyebrow">CHÀO MỪNG TRỞ LẠI</p><h1>Đăng nhập</h1><form className="form-card" onSubmit={submit}><Field label="Tên người dùng" name="userName"/><Field label="Mật khẩu" name="userPassword" type="password"/><button className="button button-dark" disabled={busy}>{busy?"Đang đăng nhập…":"Đăng nhập"}</button>{error&&<p className="error-text">{error}</p>}<p className="muted">Chưa có tài khoản? <Link to="/register">Đăng ký</Link></p></form></main>;
}

function Register() {
  const navigate=useNavigate();const [error,setError]=useState("");const [done,setDone]=useState(false);const [busy,setBusy]=useState(false);
  const submit=async e=>{e.preventDefault();setError("");const f=new FormData(e.currentTarget);if(f.get("password")!==f.get("confirm")){setError("Mật khẩu nhập lại chưa khớp.");return;}setBusy(true);try{await api.register({userName:String(f.get("userName")).trim(),userEmail:String(f.get("userEmail")).trim(),userPhone:String(f.get("userPhone")).trim(),userPassword:f.get("password"),userRole:"STUDENT"});setDone(true);setTimeout(()=>navigate("/login"),800);}catch(err){setError(err.message);}finally{setBusy(false);}};
  return <main className="container page narrow"><p className="eyebrow">UNI LIFET</p><h1>Tạo tài khoản sinh viên</h1><form className="form-card" onSubmit={submit}><Field label="Tên người dùng" name="userName"/><Field label="Email" name="userEmail" type="email"/><Field label="Số điện thoại" name="userPhone"/><Field label="Mật khẩu" name="password" type="password"/><Field label="Nhập lại mật khẩu" name="confirm" type="password"/><button className="button button-dark" disabled={busy}>{busy?"Đang tạo tài khoản…":"Đăng ký"}</button>{done&&<p className="success">Tạo tài khoản thành công. Đang chuyển tới đăng nhập…</p>}{error&&<p className="error-text">{error}</p>}</form></main>;
}

export default App;
