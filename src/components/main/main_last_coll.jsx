import { useEffect, useState } from "react"
import FirstPage from "../getFirstPageFile"
import api from "../../api"

export default function MainFirstColl({ collections, handleNext, handlePrev }){


	return (
		<>
			<div className="main-info-backgroud-elem">
				<div className="main-info-back-elem-1">
					<svg width="1920" height="1080" viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M446.697 0H0V1080H834C769.616 1065.68 663.507 1003.77 754.144 870.694C867.44 704.348 698.244 615.43 581.953 634.413C465.662 653.395 226.093 499.038 429.228 297.225C591.736 135.774 508.585 31.8039 446.697 0Z" fill="url(#paint0_linear_175_109)"/>
					<circle cx="1838" cy="1097" r="235.5" stroke="#2800D8" stroke-opacity="0.21" stroke-width="19"/>
					<circle cx="1838" cy="1097" r="164.5" stroke="#2800D8" stroke-opacity="0.09" stroke-width="19"/>
					<defs>
					<linearGradient id="paint0_linear_175_109" x1="-587" y1="1994.5" x2="1100" y2="777" gradientUnits="userSpaceOnUse">
					<stop stop-color="#2800D8"/>
					<stop offset="1" stop-color="#B7BCEF"/>
					</linearGradient>
					</defs>
					</svg>

				</div>
					
					
				<div className="main-collections-block">
					{collections[1] && (
						<div className="main-collection">
					  		<div className="main-collection-first-page">
								<FirstPage pdfUrl={`collections/${collections[1].file_url}`} />
					  		</div>
					  		<p>{collections[1].title}</p>
						</div>
				  	)}

					{collections[0] && (
						<div className="main-collection">
						  	<div className="main-collection-first-page">
								<FirstPage pdfUrl={`collections/${collections[0].file_url}`}/>
						  	</div>
							<p>{collections[0].title}</p>
						</div>
					)}

					{collections[2] && (
						<div className="main-collection">
						  	<div className="main-collection-first-page">
								<FirstPage pdfUrl={`collections/${collections[2].file_url}`}/>
						  	</div>
							<p>{collections[2].title}</p>
						</div>
				  	)}			
				</div>
	
				<div className="main-info-main">
						<div className="main-info-main-title" style={{"fontFamily": "Comfortaa"}}>
							Последние
						</div>
						<a href="/collection" className="main-link-collection">Увидеть больше</a>
						
						<div className="main-while-button">
							<button onClick={handlePrev}>
							  <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
								<circle cx="25" cy="25" r="26" transform="matrix(-1 0 0 1 52 2)" stroke="#B7C1EF" strokeWidth="2" />
								<path d="M37 26C37.5523 26 38 26.4477 38 27C38 27.5523 37.5523 28 37 28V26ZM17.2929 27.7071C16.9024 27.3166 16.9024 26.6834 17.2929 26.2929L23.6569 19.9289C24.0474 19.5384 24.6805 19.5384 25.0711 19.9289C25.4616 20.3195 25.4616 20.9526 25.0711 21.3431L19.4142 27L25.0711 32.6569C25.4616 33.0474 25.4616 33.6805 25.0711 34.0711C24.6805 34.4616 24.0474 34.4616 23.6569 34.0711L17.2929 27.7071ZM37 28L18 28V26L37 26V28Z" fill="#B7C1EF"/>
							  </svg>
							</button>

							<button onClick={handleNext}>
							  <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
								<circle cx="27" cy="27" r="26" stroke="#B7C1EF" strokeWidth="2" />
								<path d="M17 26C16.4477 26 16 26.4477 16 27C16 27.5523 16.4477 28 17 28V26ZM36.7071 27.7071C37.0976 27.3166 37.0976 26.6834 36.7071 26.2929L30.3431 19.9289C29.9526 19.5384 29.3195 19.5384 28.9289 19.9289C28.5384 20.3195 28.5384 20.9526 28.9289 21.3431L34.5858 27L28.9289 32.6569C28.5384 33.0474 28.5384 33.6805 28.9289 34.0711C29.3195 34.4616 29.9526 34.4616 30.3431 34.0711L36.7071 27.7071ZM17 28L36 28V26L17 26V28Z" fill="#B7C1EF"/>
							  </svg>
							</button>						

					</div>
				</div>

			</div>

		</>
	)
}

