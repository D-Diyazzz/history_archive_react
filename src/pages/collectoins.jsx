import Header from "../components/header"
import Footer from "../components/footer"
import { useEffect, useState } from "react"
import api from "../api";
import ColumnCollections from "../components/list_collections/column_collections";
import TileCollections from "../components/list_collections/tile_collections";

export default function Collection(){

	const [collections, setCollections] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedComponent, setSelectedComponent] = useState('column')

	useEffect(() => {
		const getCollections = async () =>{
			try{
				const response = await api.get("/collection");
				setCollections(response.data)
			} catch (error){
				
			}
		}
		getCollections();
	})

	const filteredCollections = collections.filter((collection) => {
	  const query = searchQuery.toLowerCase();
	  const titleMatch = String(collection.title).toLowerCase().includes(query);

	  let authorMatch = false;
	  if (collection.author) {
		const firstName = collection.author.firstname ? String(collection.author.firstname).toLowerCase() : "";
		const lastName = collection.author.lastname ? String(collection.author.lastname).toLowerCase() : "";
		authorMatch = firstName.includes(query) || lastName.includes(query);
	  }

	  return titleMatch || authorMatch;
	});

    return(
        <>
            <Header active={"collections"}/>
            
            <div className="list-collections-content">
				<div className="list-collections-search-filter">
					<div className="list-collections-search">
						<button className="list-collections-search-icon">
							<svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21.9995 22L16.684 16.6845M16.684 16.6845C17.5372 15.8313 18.2139 14.8185 18.6757 13.7038C19.1374 12.5891 19.375 11.3943 19.375 10.1878C19.375 8.98121 19.1374 7.78647 18.6757 6.67176C18.2139 5.55705 17.5372 4.5442 16.684 3.69103C15.8308 2.83787 14.818 2.16111 13.7033 1.69938C12.5886 1.23765 11.3938 1 10.1873 1C8.98072 1 7.78598 1.23765 6.67127 1.69938C5.55656 2.16111 4.54371 2.83787 3.69055 3.69103C1.96751 5.41407 0.999512 7.75102 0.999512 10.1878C0.999512 12.6245 1.96751 14.9615 3.69055 16.6845C5.41359 18.4075 7.75053 19.3755 10.1873 19.3755C12.624 19.3755 14.961 18.4075 16.684 16.6845Z" stroke="#00055F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

						</button>
						<input
						  type="text"
						  placeholder="Поиск сборника"
						  className="list-collections-search-input"
						  value={searchQuery}
						  onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
					
					<div className="list-collections-filter-group">
						<div className="list-collections-filter">
							<svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M9.07713 4.76953H22.0002M13.9228 18.7695H0.999756M7.99998 4.5C7.99998 6.433 6.43298 8 4.49998 8C2.56698 8 0.999981 6.433 0.999981 4.5C0.999981 2.567 2.56698 1 4.49998 1C6.43298 1 7.99998 2.567 7.99998 4.5ZM15 18.5C15 20.433 16.567 22 18.5 22C20.433 22 22 20.433 22 18.5C22 16.567 20.433 15 18.5 15C16.567 15 15 16.567 15 18.5Z" stroke="#00055F" stroke-width="2" stroke-linecap="round"/> </svg>

						</div>

						<div className={selectedComponent === 'column' ? 'list-collections-tile-column-active' : 'list-collections-column-icon'}
							onClick={() => setSelectedComponent("column")}>

							<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M0 2C0 0.895432 0.895431 0 2 0H18.9802C20.0848 0 20.9802 0.895431 20.9802 2V7.15384C20.9802 8.25841 20.0848 9.15385 18.9802 9.15385H2C0.895432 9.15385 0 8.25842 0 7.15385V2Z" fill="#B7C1EF"/>
							<path d="M0 13.8457C0 12.7411 0.89543 11.8457 2 11.8457H7.14524C8.2498 11.8457 9.14524 12.7411 9.14524 13.8457V18.9995C9.14524 20.1041 8.2498 20.9995 7.14524 20.9995H2C0.895431 20.9995 0 20.1041 0 18.9995V13.8457Z" fill="#B7C1EF"/>
							</svg>

						</div>

						<div className={selectedComponent === 'tile' ? 'list-collections-tile-icon-active' : 'list-collections-tile-icon'}
							onClick={() => setSelectedComponent("tile")}>
							<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M0.0200195 2C0.0200195 0.895432 0.91545 0 2.02002 0H7.16525C8.26982 0 9.16525 0.895431 9.16525 2V7.15384C9.16525 8.25841 8.26982 9.15385 7.16525 9.15385H2.02002C0.91545 9.15385 0.0200195 8.25842 0.0200195 7.15385V2Z" fill="#B7C1EF"/> <path d="M11.8549 2C11.8549 0.895432 12.7503 0 13.8549 0H19.0001C20.1047 0 21.0001 0.895431 21.0001 2V7.15384C21.0001 8.25841 20.1047 9.15385 19.0001 9.15385H13.8549C12.7503 9.15385 11.8549 8.25842 11.8549 7.15385V2Z" fill="#B7C1EF"/>
						<path d="M11.855 13.8457C11.855 12.7411 12.7504 11.8457 13.855 11.8457H19.0002C20.1048 11.8457 21.0002 12.7411 21.0002 13.8457V18.9995C21.0002 20.1041 20.1048 20.9995 19.0002 20.9995H13.855C12.7504 20.9995 11.855 20.1041 11.855 18.9995V13.8457Z" fill="#B7C1EF"/>
						<path d="M0.0200195 13.8457C0.0200195 12.7411 0.91545 11.8457 2.02002 11.8457H7.16525C8.26982 11.8457 9.16525 12.7411 9.16525 13.8457V18.9995C9.16525 20.1041 8.26982 20.9995 7.16525 20.9995H2.02002C0.91545 20.9995 0.0200195 20.1041 0.0200195 18.9995V13.8457Z" fill="#B7C1EF"/>
						</svg>

						</div>
					</div>
				</div>
				
				
				{selectedComponent === "column" ? (
					<ColumnCollections collections={filteredCollections}/>	
				):(
					<TileCollections collections={filteredCollections}/>
				)}
			</div>
                
        </>
    )
}
