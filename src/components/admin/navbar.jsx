export default function AdminNavbar({active}){

    const navItems = [
        { name: "Документы", id: "docs" },
        { name: "Сборники", id: "collections" },
        { name: "Выставки", id: "exhibitions" },
        { name: "Пользователи", id: "users" },
        { name: "Комментарии", id: "comments" },
        { name: "Виды сборника", id: "classes-coll" },
        { name: "Типы сборника", id: "types-coll" },
        { name: "Формат сборника", id: "format-coll" },
        { name: "Способ издания", id: "method-coll" },
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