export default function AdminNavbar({active}){

    const navItems = [
        { name: "Документы", id: "document" },
        { name: "Сборники", id: "collection" },
        { name: "Выставки", id: "exhibitions" },
        { name: "Пользователи", id: "user" },
        { name: "Комментарии", id: "comment" },
    ];

    return (
        <>
            {/* <a href="#" className="admin-navbar-element-active">Документы</a> */}
            {navItems.map((item) => (
                <a href={`/admin/${item.id}`} key={item.id} className={active === item.id ? "admin-navbar-element-active" : "admin-navbar-element"}>
                    {item.name}
                </a>
            ))}
        </>
    );

}