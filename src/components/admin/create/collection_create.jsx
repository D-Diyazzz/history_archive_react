import React, { useState, useRef, useEffect, useCallback, Children } from 'react'; import { Page } from 'react-pdf';
import DocumentMiniPanelCreate from './document_mini_panel_create';
import FirstPage from '../../getFirstPageFile';
import api from '../../../api';
import AdminMiniAdminUserList from '../mini_components/list_admin_users';
import CommentWindow from '../comments_window';

import comment_icon from "../../../style/images/icon-comment.png"
import { useNavigate } from 'react-router-dom';
import { documentForCollectionFormat } from '../../../utils/changeHTMLFormat';
import { handleCreateHeadingNumerationBlock } from '../heading_num';
import { FILES_URL } from '../../../config';
import { MouseUpTextSelectionHandler } from '../../../utils/text_selection';

export default function AdminCollectionCreate({id}) {
    const [currentFontSize, setCurrentFontSize] = useState(12);
	const [currentTextPosition, setTextPosition] = useState("left-text-position");
	const [currentPStyle, setCurrentPStyle] = useState("Normal")
    const inputRef = useRef(null);
    const spanRef = useRef(null);
	const [inputRefCurrent, setInputRefCurrent] = useState(null)

	const navigate = useNavigate();

	const [formDataState, setFormData] = useState({
		id: "",
		title: "",
		theme: "",
		is_approved: false,
		isbn_link: ""
	})


	useEffect(() => {
		const getCollection = async() => {
			try{
				const response = await api.get(`/collection/${id}/admin`);
				setFormData({
					id: response.data.id,
					title: response.data.title,
					theme: response.data.theme,
					is_approved: response.data.is_approved,
					isbn_link: response.data.isbn_link
				})
				console.log(response.data)
				setColectionType(response.data.theme)
				setSelectedDocuments(response.data.documents)
				setSelectedSciUsers(response.data.scientific_council_group)
				setSelectedRedactorUsers(response.data.redactor_group)
				setIsApproved(response.data.is_approved)
				
				const file = await fetch(FILES_URL + "collections/" + response.data.html_url);
				const file_text = await file.text()
				const regex = /<\/head>([\s\S]*)<\/html>/;
				const match = file_text.match(regex);
				

				const contentDiv = document.getElementById("pdf-redactor-page-section");

				if(match && match[1].trim()){
					contentDiv.innerHTML = match[1];
				}

			}catch(error){
				console.log(error)
			}
		}
		if(id){
			getCollection();
		}
	}, [id])
	

	const [textFormatDict, setTextFormatDict] = useState({
		bold: false,
		italic: false,

	})

	const [paragraphFormatDict, setparagraphFormatDict] = useState({
		parPosition: "left_parPosition",
		type: "normal_type",
	})

    const wrapSelectionWith = (command) => {
        document.execCommand(command, false, null);
    };


	const handleTextFormatClick = (formatType) => {
		if(textFormatDict[formatType] === true){
			setTextFormatDict(prevState => ({
			  ...prevState,
			[formatType]: false
			}));
		}else{
			setTextFormatDict(prevState => ({
			  ...prevState,
			[formatType]: true
			}));
		}
		console.log(textFormatDict)
	}

	const handleParagraphFormatClick = (parType, value) => {
		if(paragraphFormatDict[parType] !== value){
			setparagraphFormatDict(prevState => ({
				...prevState,
				[parType]: value
			}))
		}
	}

	const setTextAttributesToVariables = (range) => {
		const parentNode = range.startContainer.parentNode;

  // Скопируем текущее состояние, чтобы не мутировать напрямую
		  const newFormatDict = { ...textFormatDict };

		  Object.keys(newFormatDict).forEach(key => {
			const hasClass = parentNode.className.includes(key);
			const isActive = newFormatDict[key];

			// Если в state было true, а класс не найден — выключаем
			if (isActive === true && !hasClass) {
			  newFormatDict[key] = false;
			}
			// Если в state было false, а класс есть — включаем
			else if (isActive === false && hasClass) {
			  newFormatDict[key] = true;
			}
		  });

		  // Одним вызовом устанавливаем все нужные изменения
		  setTextFormatDict(newFormatDict);

			const ParrentFontSize = parentNode.style["font-size"].replace("px", "")
			if(ParrentFontSize != currentFontSize && ParrentFontSize != "" && ParrentFontSize != null){
				setCurrentFontSize(parseInt(ParrentFontSize))
			}else if(ParrentFontSize == currentFontSize){
			}else{
				setCurrentFontSize(12)
			}
				
			
			setParagraphAttributesToVariable(range)
	}

	const setParagraphAttributesToVariable = (range) => {
		let parNode = range.startContainer;
		while(parNode.nodeName !== "P"){
			parNode = parNode.parentNode
		}

		if(parNode.parentNode.className != "pdf-redactor-page-edit"){
			return true;
		}

		const classArray = parNode.className.split(" ") 


		classArray.forEach(style => {
			const key = style.split("_")[1]
			if(paragraphFormatDict[key] !== style){
				setparagraphFormatDict(prevState => ({
					...prevState,
					[key]: style
				}))
			}
		})	
	}

    const handleMouseUp = () => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);


		if(range.startOffset == range.endOffset){
			
			let divNode = range.startContainer;

			while(divNode.className !== "pdf-redactor-page-edit" && divNode.nodeName !== "DIV"){
				divNode = divNode.parentNode
			}

			if(divNode !== inputRef.current){
				inputRef.current = divNode
				setInputRefCurrent(divNode)
				console.log('!==')
			}

			if(range.startContainer.nodeName === "#text"){
				setTextAttributesToVariables(range)
				range.setStart(range.startContainer, range.startOffset)
				range.setEnd(range.startContainer, range.endOffset)
			}else if(range.startContainer.nodeName === "P"){
				const spanNode = range.startContainer.firstChild;
				const textNode = spanNode.firstChild
				range.setStart(textNode, 0)
				range.setEnd(textNode, 0)

				setTextAttributesToVariables(range)
				range.setStart(spanNode, 0)
				range.setEnd(spanNode, 0)
			}

		}
    };

	const cloneEmptySpan = (span) => {
		const newSpan = document.createElement("span")
		newSpan.className =  span.className
		newSpan.style.fontSize = span.style["font-size"]
		newSpan.style.height = span.style["font-size"]
		newSpan.style.display = 'inline-block'

		return newSpan;
	}

	const cloneFullP = (p) => {
		const newP = document.createElement("p")
		newP.className = p.className
		console.log(p)
		p.childNodes.forEach((child) => {
			const node = cloneEmptySpan(child)
			node.textNode = child.textNode
			newP.appendChild(node)
		})
		// newP.appendChild(childElements)
		return newP
	}

	const checkAndGetAllParrentNodes = (span) => {
		let parElements =[]
		let parElem = span
		let parparElem = parElem.parentNode
		while (parElem.nodeName !== "DIV" && parElem.className !== "pdf-redactor-page"){
			const parELemClone = parElem.cloneNode(false);
			parElements.push(parELemClone)
			parparElem = parElem.parentNode
			if(parElem.textContent.length === 0){
				console.log(parElem)
				parElem.remove()
			}
			parElem = parparElem
		}
		console.log(parElements)
		return parElements;
	}

	const checkOverFlow = (PurposeDiv) => {
		const selection = window.getSelection();
		const range = selection.getRangeAt(0);

		let divNode = range.startContainer;

		if(PurposeDiv != null){
			divNode = PurposeDiv
		}else{

			while(divNode.className !== "pdf-redactor-page-edit" && divNode.nodeName !== "DIV"){
				divNode = divNode.parentNode
			}
		}


		const parrentDiv = divNode.parentNode; //pdf-redactor-page
		const parrentDivBlock = parrentDiv.parentNode //pdf-redactor-page-block
		const originNode = parrentDiv.parentNode.parentNode; //pdf-redactor-page-section
		const style = getComputedStyle(parrentDiv);
		const paddingTop = parseFloat(style.paddingTop);
		const paddingBottom = parseFloat(style.paddingBottom);
		const contentHeight = parrentDiv.clientHeight - paddingTop - paddingBottom
		const allRedactorPageEdit = document.querySelectorAll('.pdf-redactor-page-edit')	
		const cursorPos = range.startOffset;
		if(divNode.scrollHeight >= contentHeight){
			

			let lastP = divNode.lastChild
			while(lastP.nodeName !== "P"){
				lastP = lastP.lastChild
			}

			const pToTranspose = lastP.cloneNode(true)
			
			if(originNode.lastChild === parrentDivBlock || Array.from(allRedactorPageEdit).indexOf(divNode) == allRedactorPageEdit.length-1){
				const newDiv = document.createElement("div");
				newDiv.contentEditable = "true"
				newDiv.className = "pdf-redactor-page-edit"
				newDiv.setAttribute("id", "textField");
				newDiv.addEventListener('mouseup', handleMouseUp);
				newDiv.addEventListener('keyup', (event) => {
					handleMouseUp(event);
					checkOverFlow(null);
				});
				newDiv.addEventListener('oninput', handleEditPage);


				const newParrentDiv = document.createElement("div")
				newParrentDiv.className = "pdf-redactor-page"
				newParrentDiv.appendChild(newDiv)

				const newParrentDivBlock = document.createElement("div")
				newParrentDivBlock.className = "pdf-redactor-page-block"

				newParrentDivBlock.appendChild(newParrentDiv)

				originNode.appendChild(newParrentDivBlock)
			
				newDiv.appendChild(pToTranspose);

				let currentPNode = range.startContainer.parentNode
				if(range.startContainer.nodeName === "P"){
					currentPNode = currentPNode.parentNode
				}
				if(currentPNode === lastP){
					console.log(range.startOffset)
					range.setStart(pToTranspose.firstChild, range.startOffset)
					range.setEnd(pToTranspose.firstChild, range.startOffset)
				}
				lastP.remove()
 
			} else{
				// let nextDiv = 0;
				// 
				// while(originNode.childNodes[nextDiv].firstChild !== parrentDiv){
				// 	nextDiv += 1;
				// 	console.log(nextDiv)
				// }
				// nextDiv += 1;
				// nextDiv = originNode.childNodes[nextDiv].firstChild.firstChild

				const nextDiv = allRedactorPageEdit[Array.from(allRedactorPageEdit).indexOf(divNode)+1]
				
				nextDiv.insertBefore(pToTranspose, nextDiv.firstChild)

				lastP.remove()


				checkOverFlow(divNode)
				checkOverFlow(nextDiv)
			}
			updatePageNumbers()
		}else{
			return
		}
	}
	
	
 const handleInput = (e) => {
    e.preventDefault();
	 console.log("asdf")
	 console.log(e.inputType)

    const contentEditableDiv = inputRef.current;
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
	let divOriginNode = range.startContainer;
    const text = e.data;

	while(divOriginNode.className !== "pdf-redactor-page-edit" && divOriginNode.nodeName !== "DIV"){
		divOriginNode = divOriginNode.parentNode
	}
	 console.log(23)

	if(range.startOffset != range.endOffset){
		console.log("Nan")
		console.log(range.startOffset.parentNode, range.endOffset.parentNode)
		MouseUpTextSelectionHandler(range, e.inputType, range.startOffset, range.endOffset)
		return NaN
	}

	if(e.inputType === "insertParagraph"){
		const currentSpanCursorePos = range.startOffset
		console.log(range.startContainer.nodeName)
		
		if(range.startContainer.nodeName === "DIV" && range.startContainer.className === "pdf-redactor-page-edit"){
			const newParagraph = document.createElement('p');
			let newParClass = Object.values(paragraphFormatDict).join(" ");
			newParagraph.className = `${newParClass}`;

			const newSpan = document.createElement('span')
			newSpan.className = `size-${currentFontSize}`
			newSpan.style.fontSize = `${currentFontSize}px`;
			newSpan.style.height = `${currentFontSize}px`
			newSpan.style.display = 'inline-block';
			const textNode = document.createTextNode("");
			newSpan.appendChild(textNode);

			newParagraph.appendChild(newSpan);

			range.insertNode(newParagraph);

			range.setStart(newSpan, 0)
			range.setEnd(newSpan, 0)

		}
		let paragraphNode = range.startContainer;


		while (paragraphNode.nodeName !== "P"){
			paragraphNode = paragraphNode.parentNode
		}

		let spanNode = range.startContainer

		if(range.startContainer.nodeName === "#text"){
			spanNode = range.startContainer.parentNode
		}

		const textBefore = spanNode.textContent.slice(0, currentSpanCursorePos);
		const textAfter = spanNode.textContent.slice(currentSpanCursorePos);
		const spanNodes = Array.from(paragraphNode.childNodes);
		range.setStartAfter(spanNode)
		range.setEndAfter(spanNode)
		const paragraphCursorPos = range.startOffset
		console.log(text)

		if(paragraphCursorPos === paragraphNode.childElementCount && currentSpanCursorePos === spanNode.textContent.length){
			range.setStartAfter(paragraphNode)
			range.setEndAfter(paragraphNode)
			
			const newParagraph = document.createElement('p');
			let newParClass = Object.values(paragraphFormatDict).join(" ");
			newParagraph.className = `${newParClass}`;

			let newSpanClass = "";

			newSpanClass += `size-${currentFontSize}`

			Object.keys(textFormatDict).forEach(key => {
				if (textFormatDict[key]){
					newSpanClass +=  ` ${key}`
				}
			})

			const newSpan = document.createElement('span')
			newSpan.classList = `${newSpanClass}`;
			newSpan.style.fontSize = `${currentFontSize}px`;
			newSpan.style.height = `${currentFontSize}px`
			newSpan.style.display = 'inline-block';
			const textNode = document.createTextNode("");
			newSpan.appendChild(textNode)



			newParagraph.appendChild(newSpan);

			range.insertNode(newParagraph);

			range.setStart(newSpan, 0)
			range.setEnd(newSpan, 0)
		
		}else{
			if(textBefore.length !== 0){
				console.log(textBefore.length)
				const spanBefore = document.createElement('span')
				spanBefore.className = spanNode.className;
				spanBefore.style.fontSize = spanNode.style["font-size"]
				spanBefore.style.height = spanNode.style["font-size"]
				spanBefore.style.display = 'inline-block';
				spanBefore.textContent = textBefore

				paragraphNode.insertBefore(spanBefore, spanNode)
				spanNode.remove()
			}
			else{
				const spanBefore = document.createElement('span')
				spanBefore.className = spanNode.className;
				spanBefore.style.fontSize = spanNode.style["font-size"];
				spanBefore.style.height = spanNode.style["font-size"]
				spanBefore.style.display = 'inline-block';
				const textNode = document.createTextNode("");
				spanBefore.appendChild(textNode)

				paragraphNode.insertBefore(spanBefore, spanNode)
				spanNode.remove()

			}
			
			const spanAfter = document.createElement('span')
			spanAfter.className = spanNode.className;
			spanAfter.style.fontSize = spanNode.style["font-size"]
			spanAfter.style.height = spanNode.style["font-size"]
			spanAfter.style.display = 'inline-block';
			spanAfter.textContent = textAfter

			let spanNodesAfter = spanNodes.slice(paragraphCursorPos, paragraphNode.childElementCount)
			
			range.setStartAfter(paragraphNode)
			range.setEndAfter(paragraphNode)
			
			const newParagraph = document.createElement('p');
			console.log(paragraphFormatDict)
			let newParClass = Object.values(paragraphFormatDict).join(" ");
			newParagraph.className = `${newParClass}`;
			
			newParagraph.appendChild(spanAfter)
			spanNodesAfter.forEach(node => newParagraph.appendChild(node));
			
			range.insertNode(newParagraph);
			console.log(newParagraph.firstChild)
			console.log(newParagraph.firstChild.firstChild)

			range.setStart(newParagraph.firstChild, 0);
			range.setEnd(newParagraph.firstChild, 0)
		}
		return
	} else if(e.inputType === "deleteContentBackward"){
		if(range.startContainer.nodeName === "#text"){
			const currentNode = range.startContainer
			if(range.startOffset !== 0){
				const currentOffset = range.startOffset
				const spanNode = range.startContainer.parentNode;
				if(currentNode.textContent.length > 1){
					const text = currentNode.textContent.slice(0, currentOffset-1) + currentNode.textContent.slice(currentOffset, spanNode.textContent.length)

					currentNode.textContent = text;

					range.setStart(currentNode, currentOffset-1);
					range.setEnd(currentNode, currentOffset-1)
				}else{
					range.setStartBefore(spanNode)
					range.setEndBefore(spanNode)
					const currentParNode = range.startContainer
					const parNodeCursorPos = range.startOffset
					const spanNodes = currentParNode.childNodes
					
					if(parNodeCursorPos !== 0){
						range.setStart(spanNodes[parNodeCursorPos-1].firstChild, spanNodes[parNodeCursorPos-1].textContent.length)
						range.setEnd(spanNodes[parNodeCursorPos-1].firstChild, spanNodes[parNodeCursorPos-1].textContent.length)
						spanNode.remove()
					}
					else if(parNodeCursorPos === 0 && currentParNode.childNodes.length > parNodeCursorPos+1){
						range.setStart(spanNodes[parNodeCursorPos+1].firstChild, 0);
						range.setEnd(spanNodes[parNodeCursorPos+1].firstChild, 0);
						spanNode.remove()
					}else{
						currentNode.textContent = "";
					}
				}
			}else{
				range.setStartBefore(currentNode) // span
				range.setEndBefore(currentNode)
				const currentSpanNode = range.startContainer //span
				range.setStartBefore(currentSpanNode) // p
				range.setEndBefore(currentSpanNode)
				const currentParNode = range.startContainer //p
				const parNodeCursorPos = range.startOffset
				const spanNodes = currentParNode.childNodes

				if(parNodeCursorPos !== 0 && currentSpanNode.textContent.length !== 0){
					const nextSpanNode = spanNodes[parNodeCursorPos-1]
					nextSpanNode.textContent = nextSpanNode.textContent.slice(0, nextSpanNode.textContent.length-1)
					range.setStart(nextSpanNode.firstChild, nextSpanNode.textContent.length)
					range.setEnd(nextSpanNode.firstChild, nextSpanNode.textContent.length)
				}else if(parNodeCursorPos === 0 && currentParNode.textContent.length === 0){
					range.setStartBefore(currentParNode)
					range.setEndBefore(currentParNode)
					if(range.startOffset !== 0){
						const nextP = range.startContainer.childNodes[range.startOffset-1]
						const nextSpanNode = nextP.lastChild
						range.setStart(nextSpanNode.firstChild, nextSpanNode.textContent.length)
						range.setEnd(nextSpanNode.firstChild, nextSpanNode.textContent.length)

						currentParNode.remove()
					}
				}else if(parNodeCursorPos === 0 && currentParNode.textContent.length !== 0){
					range.setStartBefore(currentParNode)
					range.setEndBefore(currentParNode)
					if(range.startOffset !== 0){
						const nextP = range.startContainer.childNodes[range.startOffset-1]
						let nextCursorPos = 0
						const spanNodesArray = Array.from(spanNodes)
						let currentNextParNodesCount = nextP.childNodes.length

						if(currentParNode.firstChild.className === nextP.lastChild.className){
							nextCursorPos = nextP.lastChild.textContent.length + 1 
							nextP.lastChild.textContent += " " + currentParNode.firstChild.textContent
							spanNodesArray.shift()
							currentNextParNodesCount -= 1
						}
						
						spanNodesArray.forEach(node => nextP.appendChild(node))
						
						range.setStart(nextP.childNodes[currentNextParNodesCount].firstChild, nextCursorPos)
						range.setEnd(nextP.childNodes[currentNextParNodesCount].firstChild, nextCursorPos)


						currentParNode.remove()
					}
				}
			}
		} else if(range.startContainer.nodeName === "P"){
			const currentParNode = range.startContainer
			if(range.startContainer.textContent.length === 0){
				range.setStartBefore(currentParNode)
				range.setEndBefore(currentParNode)
				if(range.startOffset !== 0){
					const nextP = range.startContainer.childNodes[range.startOffset-1]
					const nextSpanNode = nextP.lastChild
					range.setStart(nextSpanNode.firstChild, nextSpanNode.textContent.length)
					range.setEnd(nextSpanNode.firstChild, nextSpanNode.textContent.length)

					currentParNode.remove()
				}

			}
		}
		return
	}

	
	if(range.startContainer.nodeName === "DIV" && range.startContainer.className === "pdf-redactor-page-edit"){
		const newParagraph = document.createElement('p');
		let newParClass = Object.values(paragraphFormatDict).join(" ");
		newParagraph.className = `${newParClass}`;

		let newSpanClass = "";

		newSpanClass += `size-${currentFontSize}`

		Object.keys(textFormatDict).forEach(key => {
			if (textFormatDict[key]){
				newSpanClass += ` ${key}`
			}
		})

		const newSpan = document.createElement('span')
		newSpan.classList = `${newSpanClass}`;
		newSpan.style.fontSize = `${currentFontSize}px`;
		newSpan.style.height = `${currentFontSize}px`
		newSpan.style.display = 'inline-block';
		const textNode = document.createTextNode(text);
		newSpan.appendChild(textNode)

		newParagraph.appendChild(newSpan);

		range.insertNode(newParagraph);
		
		range.setStart(textNode, 1)
		range.setEnd(textNode, 1)
		// range.setStartAfter(newSpan);
		// range.setEndAfter(newSpan);
	}
	else if(range.startContainer.nodeName === "#text"){
		const currentNode = range.startContainer
		const currentStartOffset = range.startOffset
		const parentNode = range.startContainer.parentNode

		let someChanges = false
		
		Object.keys(textFormatDict).forEach(key => {
			if(textFormatDict[key] === true && !parentNode.className.includes(key)){
				someChanges = true;
			}else if(textFormatDict[key] === false && parentNode.className.includes(key)){
				someChanges = true;
			}
		})

		const ParrentFontSize = parentNode.style["font-size"].replace("px", "")
		if(ParrentFontSize != currentFontSize){
			someChanges = true
		}

		if(someChanges===true){
			let newSpanClass = "";

			newSpanClass += `size-${currentFontSize}`

			Object.keys(textFormatDict).forEach(key => {
				if (textFormatDict[key]){
					newSpanClass +=  ` ${key}`
				}
			})

			const newSpan = document.createElement('span')
			newSpan.classList = `${newSpanClass}`;
			newSpan.style.fontSize = `${currentFontSize}px`;
			newSpan.style.height = `${currentFontSize}px`;
			newSpan.style.display = 'inline-block';
			const textNode = document.createTextNode(text);
			newSpan.appendChild(textNode)

			if(currentStartOffset === currentNode.textContent.length){
								
				range.setStartAfter(parentNode)
				range.setEndAfter(parentNode)

				range.insertNode(newSpan)

				range.setStart(newSpan, 1)
				range.setEnd(newSpan, 1)
				
			}
			else if(currentStartOffset === 0){
				range.setStartBefore(parentNode)
				range.setEndBefore(parentNode)

				range.insertNode(newSpan)

				range.setStart(newSpan, 1)
				range.setEnd(newSpan, 1)
			}else{
				const spanClass = parentNode.className;

				const textBefore = currentNode.textContent.slice(0, currentStartOffset);
				const textAfter = currentNode.textContent.slice(currentStartOffset);
				
				const spanBefore = document.createElement('span')
				spanBefore.classList = `${spanClass}`
				spanBefore.style.fontSize = `${ParrentFontSize}px`
				spanBefore.style.height = `${ParrentFontSize}px`
				spanBefore.style.display = 'inline-block';
				spanBefore.textContent = textBefore

				const spanAfter = document.createElement('span')
				spanAfter.classList = `${spanClass}`
				spanAfter.style.fontSize = `${ParrentFontSize}px`
				spanAfter.style.height = `${ParrentFontSize}px`;
				spanAfter.style.display = 'inline-block';
				spanAfter.textContent = textAfter

				parentNode.parentNode.insertBefore(spanBefore, parentNode)
				parentNode.parentNode.insertBefore(newSpan, parentNode)
				parentNode.parentNode.insertBefore(spanAfter, parentNode)

				parentNode.remove()

				range.setStart(newSpan, 1);
				range.setEnd(newSpan, 1)


			}
		} else{
			range.startContainer.insertData(range.startOffset, text)

			range.setStart(currentNode, currentStartOffset+1)
			range.setEnd(currentNode, currentStartOffset+1)
		}
	} else if(range.startContainer.nodeName === "P"){
		const spanNode = range.startContainer.lastChild
		if(spanNode.textContent.length == 0){
			spanNode.textContent = text;
		}else{
			spanNode.childNodes[0].insertData(0, text)
		}
			range.setStart(spanNode.childNodes[0], 1)
			range.setEnd(spanNode.childNodes[0], 1)
	}

	else{
		console.log("else")
		let currentNode = range.startContainer
		const currentStartOffset = range.startOffset
		
		if(currentNode.className == "pdf-redactor-page"){
			while(currentNode.className != "pdf-redactor-page-edit"){
				 currentNode = currentNode.firstChild
			}
		}

		let someChanges = false
		
		Object.keys(textFormatDict).forEach(key => {
			if(textFormatDict[key] === true && !currentNode.className.includes(key)){
				someChanges = true;
			}else if(textFormatDict[key] === false && currentNode.className.includes(key)){
				someChanges = true;
			}
		})

		const NodeFontSize = currentNode.style["font-size"].replace("px", "")
		if(NodeFontSize != currentFontSize){
			someChanges = true
		}
		console.log(someChanges)

		if(someChanges){
			let newSpanClass = "";

			newSpanClass += `size-${currentFontSize}`

			Object.keys(textFormatDict).forEach(key => {
				if (textFormatDict[key]){
					newSpanClass += ` ${key}`
				}
			})

			if(currentNode.textContent.length === 0 && currentNode.className != "pdf-redactor-page-edit"){
				currentNode.className = newSpanClass
				currentNode.textContent = text
				range.setStart(currentNode.childNodes[0], 1)
				range.setEnd(currentNode.childNodes[0], 1)
			}
			else{
				console.log(false)

				const newParagraph = document.createElement('p');
				let newParClass = Object.values(paragraphFormatDict).join(" ");
				newParagraph.className = `${newParClass}`;


				const newSpan = document.createElement('span')
				newSpan.classList = `${newSpanClass}`;
				newSpan.style.fontSize = `${currentFontSize}px`;
				newSpan.style.height = `${currentFontSize}px`;
				newSpan.style.display = 'inline-block';
				const textNode = document.createTextNode(text);
				newSpan.appendChild(textNode)
				newParagraph.appendChild(newSpan)
				currentNode.appendChild(newParagraph)
										
				range.setStartAfter(newSpan)
				range.setEndAfter(newSpan)

				// range.setStart(newSpan, 1)
				// range.setEnd(newSpan, 1)

			}
		}else{

		
						
			currentNode.childNodes[0].insertData(currentStartOffset, text)
			
			range.setStart(currentNode.childNodes[0], currentStartOffset+1)
			range.setEnd(currentNode.childNodes[0], currentStartOffset+1)

		}
	}

	// selection.removeAllRanges();
 //  	selection.addRange(range);
};
	const handleChangeTextSettings = useCallback((event) => {
	  // Обработка ввода с использованием актуальных значений currentFontSize и textFormatDict
	  console.log('Current Font Size:', currentFontSize);
	  console.log('Text Format Dict:', textFormatDict);
	}, [currentFontSize, textFormatDict, currentTextPosition, paragraphFormatDict]);

	useEffect(() => {
		console.log("xcvb")
		// const contentEditableDiv = inputRef.current;
		const contentEditableDiv = document.getElementsByClassName("pdf-redactor-page-section")[0];
		console.log(contentEditableDiv)

		if (!contentEditableDiv) return;
		console.log(12345)
		contentEditableDiv.addEventListener('beforeinput', handleInput);

	// Clean up the event listener
		return () => {
			contentEditableDiv.removeEventListener('beforeinput', handleInput);
		};
	}, [handleChangeTextSettings]);

const toolbarRef = useRef(null);
const savedRangeRef = useRef(null);

const saveSelection = () => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    savedRangeRef.current = selection.getRangeAt(0);
  }
};

const restoreSelection = () => {
  const selection = window.getSelection();
  if (savedRangeRef.current) {
    selection.removeAllRanges();
    selection.addRange(savedRangeRef.current);
  }
};

useEffect(() => {
  const handleGlobalMouseDown = (e) => {
    const toolbarEl = toolbarRef.current;
    if (toolbarEl && toolbarEl.contains(e.target)) {
      // Сохраняем позицию курсора, если клик по toolbar
      saveSelection();
    }
  };

  document.addEventListener("mousedown", handleGlobalMouseDown);

  return () => {
    document.removeEventListener("mousedown", handleGlobalMouseDown);
  };
}, []);

	function changeParagraphStyle(className){
		const selection = window.getSelection();
    	const range = selection.getRangeAt(0);
    	
		let paragNode = range.startContainer

		while(paragNode.nodeName !== "P"){
			paragNode = paragNode.parentNode
		}
		
		let paragNodeClass = paragNode.className.split(" ")
		let find = false
		console.log(className)
		paragNodeClass.forEach((style, index) => {
			const key = style.split("_")[1]
			console.log(key)
			const currentStyle = style.split('_')[0]
			if(key == className.split("_")[1]){
				console.log(true)
				find = true
				if(style != className){
					paragNodeClass[index] = className
					paragNode.className = paragNodeClass.join(" ")
				}
			}
		}) 

		if(find === false){
			paragNode.className += ` ${className}`
		}

	}


	
	const [showPanel, setShowPanel] = useState(null);

	const handleButtonAddDocClick = () => {
		setShowPanel(true);
	}
	
	const handleCloseOverlay = () => {
		setShowPanel(null);
	}

	const openPanel = (panelType) => {
		if(panelType === "document"){
			setShowPanel(
					<>
						<div className="admin-section-document-mini-overlay" onClick={handleCloseOverlay}></div>
					<DocumentMiniPanelCreate 
						handleCloseOverlay={handleCloseOverlay}
						setSelectedDocuments={addDocument}
						selectedDocuments={selectedDocuments}
						collectionId={formDataState.id}
					/>

					</>
				)

		}else if(panelType === "scientific_council_group"){
			setShowPanel(
					<>
						<div className="admin-section-document-mini-overlay" onClick={handleCloseOverlay}></div>
						<AdminMiniAdminUserList
							handleCloseOverlay={handleCloseOverlay}
							setSelectedUsers={setSelectedSciUsers}
							selectedUsers={selectedSciUsers}
							collectionId={formDataState.id}
							typeUser={"SciUser"}
						/>
					</>
				)
		}else if(panelType === "redactor_group"){
			setShowPanel(
				<>
					<div className="admin-section-document-mini-overlay" onClick={handleCloseOverlay}></div>
					<AdminMiniAdminUserList
						handleCloseOverlay={handleCloseOverlay}
						setSelectedUsers={setSelectedRedactorUsers}
						selectedUsers={selectedRedactorUsers}
						collectionId={formDataState.id}
						typeUser={"RedactorUser"}
					/>
				</>
			)
		}
	}

	const [errors, setErrors] = useState({
		title: false,
		theme: false,
		is_approved: false
	})
	
	const handleChange = (e, setTarget, setTargetErrors) => {
		const {name, value} = e.target;
		setTarget(prevState => ({
			...prevState,
			[name]: value
		}))
		setTargetErrors(prev => ({...prev, [name]: !value}))
	}

 	const [colectionType, setColectionType] = useState('');
    const [customType, setCustomType] = useState('');

    const colectionOptions = [
        "Научный","Научно-популярный", "Учебный", "Другое"
    ];

    const handleChangeColType = (event) => {
        const { value } = event.target;
        if(value === 'Другое'){
            setColectionType("Другое")
            setFormData(prevFormData => ({
                ...prevFormData,
                theme: ""
            }));
        }else{
            setFormData(prevFormData => ({
                ...prevFormData,
                theme: value  
            }));
            setColectionType(value)
        }

        setErrors(prev => ({...prev, ["theme"]: !value}))
    };

	const [selectedDocuments, setSelectedDocuments] = useState([]);

	const getFirstFile = (file) => {
		const type = file.split(".")[1]
		switch (type){
			case 'pdf':
				return <FirstPage pdfUrl={file} /> 
		}
	}

	const addDocument = (doc) => {
		const selection = window.getSelection();
		selection.removeAllRanges();
  		selection.addRange(savedRangeRef.current);
		const range = selection.getRangeAt(0);
		setSelectedDocuments(prevDocuments => [...prevDocuments, doc])
		
		const paragraphsQueue = documentForCollectionFormat(doc)
		console.log(paragraphsQueue)
		console.log(range.startContainer)
		if(range.startContainer === "pdf-redactor-page-edit"){
			console.log('pdf-redactor-page-edit')
			const newParagraph = document.createElement('p');
			let newParClass = Object.values(paragraphFormatDict).join(" ");
			newParagraph.className = `${newParClass}`;
			range.insertNode(newParagraph)
			range.setStartAfter(newParagraph)
		}else{
			let block = range.startContainer
			while(block.nodeName !== 'P'){
				block = block.parentNode
			}
			range.setStartAfter(block)
			range.setEndAfter(block)
		}
		console.log(345)
	
		while(!paragraphsQueue.isEmpty()){
			const newp = paragraphsQueue.dequeue()
			console.log(newp)
			range.insertNode(newp)
			checkOverFlow()
			range.setStartAfter(newp)
			range.setEndAfter(newp)
		}
	}

	const handleRemoveDocument = async (obj) => {
		try{
			
			const response = await api.delete(`/collection/${formDataState.id}/document`, {
			  data: {
				doc_id: obj.id,
				doc_type: obj.type
			  }
			});

			if(response.status == 200){
				setSelectedDocuments(prevDocuments =>
            		prevDocuments.filter(doc => doc.id !== obj.id)
        		);
			}
		}
		catch(error){
			console.log(error)
		}
    };

	const [selectedSciUsers, setSelectedSciUsers] = useState([]);
	const [selectedRedactorUsers, setSelectedRedactorUsers] = useState([]);
	
	const handleRemoveUser = async(user, setSelectedUsers) => {
		try{
			const response = await api.delete(`/collection/${formDataState.id}/user_group?user_id=${user.id}`);

			if(response.status == 200){
				setSelectedUsers(prevUser => prevUser.filter(u => u.id !== user.id))
			}
		}catch(error){
			console.log(error)
		}
	}

	// const handleRemoveRedactorUser = async(user) => {
	// 	try{
	// 		const response = await api.delete(`/collection/${formDataState.id}/user_group?user_id=${user.id}`);
	// 		if(response.status == 200){
	// 			setSelectedRedactorUsers(prevUser => prevUser.filter(u => u.id !== user.id))
	// 		}
	// 	} catch(error){
	// 		console.log(error)
	// 	}
	// }

	useEffect(() => {
		const updateCollectionData = async () => {
			const contentDiv = document.getElementById("pdf-redactor-page-section");
			const dataToSend = {
				theme: formDataState.theme,
				title: formDataState.title,
				html_data: contentDiv.innerHTML
			}
			console.log(dataToSend)
			console.log(formDataState.title)

			try{
				const response = await api.patch(`/collection/${id}`,dataToSend)

			}catch(error){

			}
		}

		const intervalId = setInterval(updateCollectionData, 5000);
		return () => clearInterval(intervalId)
	}, [formDataState]);
	
	const renderDocument = (obj, index) => {
		switch (obj.type){
			case "document":
				return (
					<div className="admin-selected-doc">
						<div className="document-selected">
							<div className="document-selected-file">
							{
								obj.file_urls ? (
									getFirstFile(obj.file_urls[0])
								):(
									<></>
								)
							}
							</div>
							<div className="document-selected-info">
								<p className="doc-selected-info-p">Номер: {index+1}</p>
								<p className="doc-selected-info-p">Автор: {obj.author}</p>
								<p className="doc-selected-info-p">Адресат: {obj.addressee}</p>
								<p className="doc-selected-info-p">Дата: {obj.dating}</p>
								<p className="doc-selected-info-p">Тип: {obj.type}</p>

	
								
							</div>
							
						</div>

					<button className="doc-selected-del-btn" onClick={() => handleRemoveDocument(obj)}>Удалить</button>
					</div>
				)

			case "video_document":
				return (
					<div className="admin-selected-doc">
						<div className="document-selected">
							<div className="document-selected-info" style={{"width": "90%"}}>
								<p className="doc-selected-info-p">Номер: {index+1}</p>
								<p className="doc-selected-info-p">Автор: {obj.author}</p>
								<p className="doc-selected-info-p">Место создания: {obj.place_of_creating}</p>
								<p className="doc-selected-info-p">Дата: {obj.dating}</p>
								<p className="doc-selected-info-p">Тип: {obj.type}</p>			
							</div>
							
						</div>
					<button className="doc-selected-del-btn" onClick={() => handleRemoveDocument(obj)}>Удалить</button>
					</div>
				)	
			case "photo_document":
				return (
					<div className="admin-selected-doc">
						<div className="document-selected">
							<div className="document-selected-info" style={{"width": "90%"}}>
								<p className="doc-selected-info-p">Номер: {index+1}</p>
								<p className="doc-selected-info-p">Автор: {obj.author}</p>
								<p className="doc-selected-info-p">Место создания: {obj.place_of_creating}</p>
								<p className="doc-selected-info-p">Дата: {obj.dating}</p>
								<p className="doc-selected-info-p">Тип: {obj.type}</p>			
							</div>
							
						</div>
					<button className="doc-selected-del-btn" onClick={() => handleRemoveDocument(obj)}>Удалить</button>
					</div>
				)	

			case "phono_document":
				return (
					<div className="admin-selected-doc">
						<div className="document-selected">
							<div className="document-selected-info" style={{"width": "90%"}}>
								<p className="doc-selected-info-p">Номер: {index+1}</p>
								<p className="doc-selected-info-p">Автор: {obj.author}</p>
								<p className="doc-selected-info-p">Место создания: {obj.place_of_creating}</p>
								<p className="doc-selected-info-p">Дата: {obj.dating}</p>
								<p className="doc-selected-info-p">Тип: {obj.type}</p>			
							</div>
							
						</div>
					<button className="doc-selected-del-btn" onClick={() => handleRemoveDocument(obj)}>Удалить</button>
					</div>
				)	

		}
	}

	const [selectedUser, setSelectedUser] = useState(null);

	// Функция для открытия окна с комментарием и передачи данных выбранного пользователя
	const openCommentWindow = (obj) => {
		setSelectedUser({
			coll_id: obj.coll_id,
			user_id: obj.id,
			user_email: obj.email,
		});
	};

	const renderSciUser = (obj) => {
		return (
			<>
			<div className="admin-selected-u">
				<div className="user-selected">
					<div className="user-selected-photo">
					</div>

					<div className="user-selected-info">
						<p className="user-selected-name">{obj.firstname} {obj.lastname}</p>
						<p className="user-selected-email">{obj.email}</p>
					</div>
					
					<div className="user-selected-approved">
						<div className={obj.is_approved ? 'user-selected-approved-t' : 'user-selected-approved-f'}>
						</div>
					</div>
				</div>
				<div className="user-selected-del-btn" onClick={() => handleRemoveUser(obj, setSelectedSciUsers)}>X</div>
				<div className="selected-u-comment" onClick={() => openCommentWindow(obj)}><img src={comment_icon}/></div>
			</div>
			</>
		)
	}

	const renderRedactorUser = (obj) => {
		return (
			<div className="admin-selected-u">
				<div className="user-selected">
					<div className="user-selected-photo">
					</div>

					<div className="user-selected-info">
						<p className="user-selected-name">{obj.firstname} {obj.lastname}</p>
						<p className="user-selected-email">{obj.email}</p>
					</div>
					
				</div>
				<div className="user-selected-del-btn" onClick={() => handleRemoveUser(obj, setSelectedRedactorUsers)}>X</div>
				<div className="selected-u-comment" onClick={() => openCommentWindow(obj)}><img src={comment_icon}/></div>

			</div>
		)
	}

	const [isApproved, setIsApproved] = useState(false);

	const handleApprove = async () => {
		if(isApproved){
			try{
				const response = await api.patch(`/collection/${formDataState.id}/approve?approve=false`)
				if(response.status === 200){
					setIsApproved(false)
				}
			}catch(error){

			}
		}else{
			try{
				const allApproved = selectedSciUsers.every(user => user.is_approved === true);
				const response = await api.patch(`/collection/${formDataState.id}/approve?approve=${allApproved}`)
				if(response.status === 200){
					setIsApproved(allApproved)
				}
			}catch(error){

			}
		}
	}

	const handleFileChange = (event) => {
		console.log(123)
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			
			// Читаем файл как Data URL
			reader.onload = function(e) {
				console.log(event.target)
				const parentDiv = event.target.parentNode;
				const originDiv = parentDiv.parentNode.parentNode;
				const pageDiv = originDiv.firstChild;

				// Устанавливаем background-image как Data URL
				pageDiv.style.backgroundImage = `url(${e.target.result})`;
			};
			
			// Запускаем чтение файла
			reader.readAsDataURL(file);
		}
	};
	
	const [isCommentWindowVisible, setCommentWindowVisible] = useState(false);
	
	const toggleModal = () => {
        setCommentWindowVisible(!isCommentWindowVisible);
    };

	const handleDeleteCollection = async (id) => {
		const isConfirmed = window.confirm("Вы уверены, что хотите удалить эту коллекцию?");
    if (isConfirmed) {
          try {
            const response = await api.delete(`/collection/${id}`);
			console.log(response)
			if(response.status == 200){
				navigate('/admin/collection')
			}
          } catch (error) {
            console.error("Ошибка при удалении коллекции:", error);
          }
        }

	}

	const updatePageNumbers = () => {
		let pagesRef = Array.from(document.querySelectorAll('.pdf-redactor-page'));

    	pagesRef.forEach((page, index) => {
        	const pageNumberElement = page.querySelector('.pdf-redactor-page-number');
        	if (pageNumberElement) {
          		pageNumberElement.textContent = index + 1;
        	} else {
    	      // Если элемент с номером страницы еще не существует, создаем его
	          const numberElement = document.createElement('div');
        	  numberElement.className = 'pdf-redactor-page-number';
	          numberElement.textContent = index + 1;
    	      page.appendChild(numberElement);
        	}
      });
    };

	const hidePageNumber = (e) => {
		let target = e.target;

	  // Ищем ближайший элемент с классом 'pdf-redactor-page-block'
		  while (target && !target.classList.contains('pdf-redactor-page-block')) {
			target = target.parentNode;
		  }

		  // Если элемент найден
		  if (target) {
			// Находим элемент с номером страницы
			let pageNumber = target.querySelector('.pdf-redactor-page-number');
			if (pageNumber) {
			  // Скрываем элемент
			  pageNumber.style.display = "none";
			}
		  }
	}

	const handleEditPage = (event) => {
		const range = window.getSelection().getRangeAt(0);
		console.log(123)
		console.log(event.inputType)
		const node = range.startContainer;

		if(node.nodeName === "#text"){
			const newParagraph = document.createElement("p");
			let newParClass = Object.values(paragraphFormatDict).join(" ");
			newParagraph.className = `${newParClass}`

			let newSpanClass = "";
			const text = e.data
			
			newSpanClass += `size-${currentFontSize}`
			Object.keys(textFormatDict).forEach(key => {
				if(textFormatDict[key]){
					newSpanClass += ` ${key}`
				}
			})

			const newSpan = document.createElement('span')
			
			newSpan.classList = `${newSpanClass}`;
			newSpan.style.fontSize = `${currentFontSize}px`;
			newSpan.style.height = `${currentFontSize}px`
			newSpan.style.display = 'inline-block';
			const textNode = document.createTextNode(text);
			newSpan.appendChild(textNode)

			newParagraph.appendChild(newSpan);

			range.insertNode(newParagraph);
			
			range.setStart(textNode, 1)
			range.setEnd(textNode, 1)

		}
	}

	const [isEditing, setIsEditing] = useState(false);
	
	const handleISBNChange = (e) => {
    	const { name, value } = e.target;
		console.log(value)
    	setFormData((prev) => ({
      		...prev,
      		[name]: value,
    	}));
    // Если требуется, обновляем ошибки
    setErrors((prev) => ({ ...prev, [name]: !value }));
  };

  // Функция сохранения (отправка запроса на бекенд)
  const handleSaveIsbn = async () => {
    try {
      // Пример запроса. Измените URL и метод в зависимости от вашего API.
      const response = await api.post(`/collection/${id}/isbn`, {"isbn_link": formDataState.isbn_link});
      // Можно добавить уведомление об успешном сохранении
      setIsEditing(false); // переключаем режим редактирования off
    } catch (error) {
      console.error("Ошибка при сохранении ISBN", error);
      // Обработка ошибки, например, вывод сообщения
    }
  };

	// useEffect(() => {
	// 	console.log('use')
	// 	updatePageNumbers()	
	// }, [inputRef])
    return (
        <>
            <p className="admin-title-text">Создание Сборника</p>

            <div className="admin-section">
				<div className="admin-section-row">
                <form className="admin-section-create-form" onSubmit={(e) => {e.preventDefault()}}>
                    <div className="admin-form-column">
			
						<div className="admin-section-form-inputs">	
							<div className="admin-form-row">
								<div className="admin-form-row-label">
									<label htmlFor="title">Название: </label>
								</div>
								<input 
									className={errors.title ? 'admin-form-input input-error' : 'admin-form-input'} 
									type="text" name="title" id="theme" 
									onChange={(e) => handleChange(e, setFormData, setErrors)} value={formDataState.title}
								/>
							</div>

							<div className="admin-form-row-label">
								<div className="admin-form-row-label">
									<p>ISBN:</p>
								</div>
								<input
        className={errors.isbn_link ? "admin-form-input input-error" : "admin-form-input"}
        type="text"
        name="isbn_link"
        value={formDataState.isbn_link}
        onChange={handleISBNChange}
        readOnly={!isEditing} // input доступен только в режиме редактирования
      />
      {isEditing ? (
        <button type="button" onClick={handleSaveIsbn} className="isbn-save-button">
          {/* Здесь можно вставить иконку галочки */}
          ✓
        </button>
      ) : (
        <button type="button" onClick={() => setIsEditing(true)} className="isbn-edit-button">
          Редактировать
        </button>
      )}

							</div>

							<div className="admin-form-row">
								<div className="admin-form-row-label">
									<label htmlFor="theme">Тип сборника: </label>
								</div>
								<select value={colectionType} onChange={handleChangeColType} className={errors.theme ? 'admin-form-input input-error' : "admin-form-select"}>
									{colectionOptions.map(option => (
										<option key={option} value={option}>{option}</option>
									))}
								</select>
								{colectionType === 'Другое' && (
									<input
										className={errors.theme ? 'admin-form-input input-error' : 'admin-form-input'}
										type="text"
										name="theme"
										// placeholder="Введите название документа"
										value={formDataState.theme}
										onChange={(e) => handleChange(e, setFormData, setErrors)}
									/>
								)}
							</div>

							<div className="admin-form-row">
								<div className="admin-form-row-label">
									<label htmlFor="approve">Одобренно</label>
								</div>
								
								<div className="toggle-container">
									<label class="switch">
										<input type="checkbox" checked={isApproved} onChange={handleApprove}/>
										<span class="slider round"></span>
									</label>
									<p className="toggle-p" id="toggle-state">{isApproved ? 'Да' : 'Нет'}</p>
								</div>
							</div>

						
						</div>
			
                        <div className="admin-form-row-label">
                            <label>Test pdf creator</label>
                        </div>

                        <div className="pdf-redactor-section">
                            <div className="pdf-redactor-tools" ref={toolbarRef}>
                                <div className="pdf-redactor-text-style-tools">
                                    <p 
										onMouseDown={saveSelection}
										onClick={() => {restoreSelection(); handleTextFormatClick("bold")}}
										className={textFormatDict["bold"] ? 'pdf-redactor-tool-selected' : ''}
										><strong>B</strong></p>
                                    <p 
										onMouseDown={saveSelection}
										onClick={() => { saveSelection(); handleTextFormatClick("italic")}}
										className={textFormatDict["italic"] ? 'pdf-redactor-tool-selected' : ''}

										><i>I</i></p>

									<input type="color" id="colorPicker" />

                                </div>

                                <div className="pdf-redactor-alignment-tools">
                                    <p
										onMouseDown={saveSelection}
										onClick={() => {restoreSelection(); changeParagraphStyle("left_parPosition")}}
										className={paragraphFormatDict['parPosition'] === "left_parPosition" ? 'pdf-redactor-tool-selected' : ''}
									>L</p>
                                    <p
										onMouseDown={saveSelection}
										onClick={() => {restoreSelection(); changeParagraphStyle("central_parPosition")}}
										className={paragraphFormatDict['parPosition'] === "central_parPosition" ? 'pdf-redactor-tool-selected' : ''}
									>C</p>
                                    <p
										onMouseDown={saveSelection}
										onClick={() => {restoreSelection(); changeParagraphStyle("right_parPosition")}}
										className={paragraphFormatDict['parPosition'] === "right_parPosition" ? 'pdf-redactor-tool-selected' : ''}
									>R</p>
                                </div>

								<div className="pdf-redacotr-alignment-tools">
									<div class="font-selector">
								  <select class="font-select" value={paragraphFormatDict['type']}onMouseDown={saveSelection} onChange={(e) => {restoreSelection(); changeParagraphStyle(e.target.value)}}>
									<option value="normal_type" selected>Обычный текст</option>
									<option value="heading_type">Заголовок</option>
									<option value="subHeading_type">Подзаголовок</option>
								  </select>
								  
								</div>
								</div>

                                <div className="pdf-redactor-font-size">
									<p onMouseDown={saveSelection} onClick={() => {restoreSelection(); setCurrentFontSize(currentFontSize-1)}}>-</p>
                                    <input 
                                        type="number"
										id="fontSizeInput"
                                        value={currentFontSize} 
										onMouseDown={saveSelection}
                                        onChange={(e) => {restoreSelection(); setCurrentFontSize(e.target.value)}}
                                    />
									<p onMouseDown={saveSelection} onClick={() => {restoreSelection(); setCurrentFontSize(currentFontSize+1)}}>+</p>
                                </div>
					
								<div className="pdf-redactor-heading-num">
									<p onMouseDown={saveSelection} onClick={() => {restoreSelection(); handleCreateHeadingNumerationBlock(window.getSelection().getRangeAt(0), handleMouseUp, checkOverFlow, handleEditPage, handleFileChange)}} className="pdf-redactor-heading-num-button">H1...1</p>
								</div>
                            </div>

                            <div className="pdf-redactor-page-section" id="pdf-redactor-page-section" contentEditable="true"  suppressContentEditableWarning={true}
		onMouseDown={handleMouseUp}
											onInput={(event) => {
												console.log(2345)
												handleEditPage(event)}}
											onKeyUp={(event) => {
												handleMouseUp(event);
												checkOverFlow(null);
											}}
											res={inputRef}
											
											>
								<div className="pdf-redactor-page-block">
									<div
										className="pdf-redactor-page" 
									>
										<div
											className="pdf-redactor-page-edit"
											id="textField"
										>
										</div>
									</div>
									{/*<div className="pdf-redactor-page-tools">
										<div className="pdf-page-tool">
											<label htmlFor="back-img">I</label>
											<input type="file" id="back-img" onChange={handleFileChange} className="pdf-page-tool-input" accept="image/"/>
										</div>

										<div className="pdf-page-tool">
											<label htmlFor="del-num"><span class="diagonal-strike">1</span></label>
											<input type="button" id="del-num" className="pdf-page-tool-input" onClick={hidePageNumber}/>
										</div>
									</div> */}
								</div>
							</div>
                        </div>

						<div className="admin-delete-collection">
							<button type="button" onClick={() => handleDeleteCollection(id)}>Удалить</button>
						</div>
                    </div>
                </form>

                <div className="admin-section-add">
					<div className="admin-section-add-docs"> 
						<p className="add-docs-p"><strong>Документы:</strong></p>
						{
							selectedDocuments.map((doc, index) => {
								return renderDocument(doc, index)
							})
						}	
						<div className="add-docs-button" onMouseDown={saveSelection} onClick={() => openPanel("document")}>
							+ Добавить документ
						</div>
					</div>

					<div className="admin-section-add-docs"> 
						<p className="add-docs-p"><strong>Научный совет:</strong></p>
						{
							selectedSciUsers.map((user) => {
								return renderSciUser(user)
							})
						}
					
						<div className="add-docs-button" onClick={() => openPanel("scientific_council_group")}>
							+ Добавить 
						</div>
					</div>
					
					<div className="admin-section-add-docs"> 
						<p className="add-docs-p"><strong>Редакторы:</strong></p>
						{
							selectedRedactorUsers.map((user) => {
								return renderRedactorUser(user)
							})
						}
					
						<div className="add-docs-button" onClick={() => openPanel("redactor_group")}>
							+ Добавить
						</div>
					</div>

					<div className="admin-section-add-docs">
						{selectedUser && (
				<CommentWindow
					onClose={() => setSelectedUser(null)}
					coll_id={id}
					user_id={selectedUser.user_id}
					user_email={selectedUser.user_email}
				/>)}

					</div>

                </div>
				</div>
            </div>

			{showPanel}
        </>
    );
}

