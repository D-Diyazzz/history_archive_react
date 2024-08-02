import React, { useState, useRef, useEffect, useCallback, Children } from 'react';
import { Page } from 'react-pdf';

export default function AdminCollectionCreate() {
    const [currentFontSize, setCurrentFontSize] = useState(12);
	const [currentTextPosition, setTextPosition] = useState("left-text-position");
    const inputRef = useRef(null);
    const spanRef = useRef(null);
	const [inputRefCurrent, setInputRefCurrent] = useState(null)
	

	const [textFormatDict, setTextFormatDict] = useState({
		bold: false,
		italic: false,

	})

    const wrapSelectionWith = (command) => {
        document.execCommand(command, false, null);
    };

    const handleBoldClick = () => {
        wrapSelectionWith('bold');
    };

    const handleItalicClick = () => {
        wrapSelectionWith('italic');
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

	const setTextAttributesToVariables = (range) => {
		const currentNode = range.startContainer
			const currentStartOffset = range.startOffset
			const parentNode = range.startContainer.parentNode
			
			Object.keys(textFormatDict).forEach(key => {
				if(textFormatDict[key] === true && !parentNode.className.includes(key)){
					setTextFormatDict(prevState => ({
					  ...prevState,
					[key]: false
					}));

				}else if(textFormatDict[key] === false && parentNode.className.includes(key)){
					setTextFormatDict(prevState => ({
					  ...prevState,
					[key]: true
					}));
				}
			})

			const ParrentFontSize = parentNode.style["font-size"].replace("px", "")
			if(ParrentFontSize != currentFontSize){
				setCurrentFontSize(parseInt(ParrentFontSize))
			}else if(ParrentFontSize == NaN){
				setCurrentFontSize(12)
			}
			
			setTextPosition(parentNode.parentNode.className)

	}

    const handleMouseUp = () => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

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
    };

	const cloneEmptySpan = (span) => {
		const newSpan = document.createElement("span")
		newSpan.className =  span.className
		newSpan.style.fontSize = span.style["font-size"]
		newSpan.style.height = span.style["font-size"]
		newSpan.style.display = 'inline-block'

		return newSpan;
	}
	
	const checkAndGetAllParrentNodes = (span) => {
		let parElements = []
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

	const checkOverFlow = (e) => {
		const selection = window.getSelection();
		const range = selection.getRangeAt(0);

		let divNode = range.startContainer;

		while(divNode.className !== "pdf-redactor-page-edit" && divNode.nodeName !== "DIV"){
			divNode = divNode.parentNode
		}


		const parrentDiv = divNode.parentNode;
		const originNode = parrentDiv.parentNode;
		const style = getComputedStyle(parrentDiv);
		const paddingTop = parseFloat(style.paddingTop);
		const paddingBottom = parseFloat(style.paddingBottom);
		const contentHeight = parrentDiv.clientHeight - paddingTop - paddingBottom
		
		const cursorPos = range.startOffset;
		if(divNode.scrollHeight >= contentHeight){
			
			
			if(originNode.lastChild === parrentDiv){
				console.log(123)
				const newDiv = document.createElement("div");
				newDiv.contentEditable = "true"
				newDiv.className = "pdf-redactor-page-edit"
				newDiv.setAttribute("id", "textField");
				newDiv.addEventListener('mouseup', handleMouseUp);
				newDiv.addEventListener('keyup', handleMouseUp);
				newDiv.addEventListener('keyup', checkOverFlow);

				const newParrentDiv = document.createElement("div")
				newParrentDiv.className = "pdf-redactor-page"
				newParrentDiv.appendChild(newDiv)

				originNode.appendChild(newParrentDiv)

				let lastSpan = divNode.lastChild
				while(lastSpan.nodeName !== "SPAN"){
					lastSpan = lastSpan.lastChild
				}

				const words = lastSpan.textContent.split(" ")
				const textToTranspose = words.pop()
				const textToLeave = words.join(" ")
				lastSpan.textContent = textToLeave
				
				const newSpan = cloneEmptySpan(lastSpan)
				let newCursorPos = 0
				if(textToTranspose){
					newSpan.textContent = textToTranspose
					newCursorPos = textToTranspose.length
				}else{
					newSpan.textContent = " "
				}
				
				const newParagraph = document.createElement('p');
				newParagraph.className = `${currentTextPosition}`

				newParagraph.appendChild(newSpan);

				newDiv.appendChild(newParagraph);

				let currentSpanNode = range.startContainer

				if(range.startContainer.nodeName === "#text"){
					currentSpanNode = range.startContainer.parrentNode
				}
				if(currentSpanNode === lastSpan && cursorPos >= textToLeave.length){
					range.setStart(newSpan.firstChild, newCursorPos)
					range.setEnd(newSpan.firstChild, newCursorPos)
					inputRef.current = newDiv
				}
				checkAndGetAllParrentNodes(lastSpan)
 
			}
		}else{
			return
		}
	}
	
	
 const handleInput = (e) => {
    e.preventDefault();

    const contentEditableDiv = inputRef.current;
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
	let divOriginNode = range.startContainer;
    const text = e.data;

	while(divOriginNode.className !== "pdf-redactor-page-edit" && divOriginNode.nodeName !== "DIV"){
		divOriginNode = divOriginNode.parentNode
	}

	if(e.inputType === "insertParagraph"){
		const currentSpanCursorePos = range.startOffset
		
		if(range.startContainer.nodeName === "DIV" && range.startContainer.className === "pdf-redactor-page-edit"){
			const newParagraph = document.createElement('p');
			newParagraph.className = `${currentTextPosition}`;

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
			newParagraph.className = `${currentTextPosition}`;

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
			}else{
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
			newParagraph.className = `${currentTextPosition}`;
			
			newParagraph.appendChild(spanAfter)
			spanNodesAfter.forEach(node => newParagraph.appendChild(node));
			
			range.insertNode(newParagraph);

			range.setStart(newParagraph.firstChild.firstChild, 0);
			range.setEnd(newParagraph.firstChild.firstChild, 0)
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
		newParagraph.className = `${currentTextPosition}`;

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
		spanNode.childNodes[0].insertData(0, text)

		range.setStart(spanNode.childNodes[0], 1)
		range.setEnd(spanNode.childNodes[0], 1)
	}

	else{
		const currentNode = range.startContainer
		const currentStartOffset = range.startOffset

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

		if(someChanges){
			let newSpanClass = "";

			newSpanClass += `size-${currentFontSize}`

			Object.keys(textFormatDict).forEach(key => {
				if (textFormatDict[key]){
					newSpanClass += ` ${key}`
				}
			})

			if(currentNode.textContent.length === 0){
				currentNode.className = newSpanClass
				currentNode.textContent = text
				range.setStart(currentNode.childNodes[0], 1)
				range.setEnd(currentNode.childNodes[0], 1)
			}
			else{
				const newSpan = document.createElement('span')
				newSpan.classList = `${newSpanClass}`;
				newSpan.style.fontSize = `${currentFontSize}px`;
				newSpan.style.height = `${currentFontSize}px`;
				newSpan.style.display = 'inline-block';
				const textNode = document.createTextNode(text);
				newSpan.appendChild(textNode)

										
				range.setStartAfter(parentNode)
				range.setEndAfter(parentNode)
				range.insertNode(newSpan)

				range.setStart(newSpan, 1)
				range.setEnd(newSpan, 1)

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
	}, [currentFontSize, textFormatDict, currentTextPosition]);

	useEffect(() => {
		const contentEditableDiv = inputRef.current;

		if (!contentEditableDiv) return;
		contentEditableDiv.addEventListener('beforeinput', handleInput);

	// Clean up the event listener
		return () => {
			contentEditableDiv.removeEventListener('beforeinput', handleInput);
		};
	}, [handleChangeTextSettings]);

	useEffect(() => {
		console.log(inputRef.current)
		console.log('useEff')
        const contentEditableDiv = inputRef.current;
        if (!contentEditableDiv) return;

        let savedRange;

        const saveRangeMouseUp = () => {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                savedRange = selection.getRangeAt(0);
            }
        };

        const handleKeyUp = () => {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                savedRange = selection.getRangeAt(0);
            }
        };

        // const handleFocus = () => {
        //     if (savedRange) {
        //         const selection = window.getSelection();
        //         selection.removeAllRanges();
        //         selection.addRange(savedRange);
        //     }
        // };

        const handleBlur = (event) => {
            if (!contentEditableDiv.contains(event.target)) {
                contentEditableDiv.blur();
            }
        };

        const handleDocumentMouseUp = (event) => {
            if (!contentEditableDiv.contains(event.target) && event.target !== document.activeElement) {
                contentEditableDiv.focus();
                if (savedRange) {
                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(savedRange);
                }
            }
        };

        contentEditableDiv.addEventListener('mouseup', saveRangeMouseUp);
        contentEditableDiv.addEventListener('keyup', handleKeyUp);
        // contentEditableDiv.addEventListener('focus', handleFocus);
        document.addEventListener('mousedown', handleBlur);
        document.addEventListener('mouseup', handleDocumentMouseUp);

        // Clean up the event listeners
        return () => {
            contentEditableDiv.removeEventListener('mouseup', saveRangeMouseUp);
            contentEditableDiv.removeEventListener('keyup', handleKeyUp);
            // contentEditableDiv.removeEventListener('focus', handleFocus);
            document.removeEventListener('mousedown', handleBlur);
            document.removeEventListener('mouseup', handleDocumentMouseUp);
        };
    }, [inputRef.current]);

	function changeParagraphStyle(className){
		const selection = window.getSelection();
    	const range = selection.getRangeAt(0);
    	
		let paragNode = range.startContainer

		while(paragNode.nodeName !== "P"){
			paragNode = paragNode.parentNode
		}
		
		paragNode.className = className
		setTextPosition(className)

	}

    return (
        <>
            <p className="admin-title-text">Создание Сборника</p>

            <div className="admin-section">
                <form className="admin-section-create-form" onSubmin={(e) => {e.preventDefault()}}>
                    <div className="admin-form-column">
                        <div className="admin-form-row-label">
                            <label>Test pdf creator</label>
                        </div>

                        <div className="pdf-redactor-section">
                            <div className="pdf-redactor-tools">
                                <div className="pdf-redactor-text-style-tools">
                                    <p 
										onMouseDown={handleBoldClick}
										onClick={() => handleTextFormatClick("bold")}
										className={textFormatDict["bold"] ? 'pdf-redactor-tool-selected' : ''}
										><strong>B</strong></p>
                                    <p 
										onClick={() => handleTextFormatClick("italic")}
										onMouseDown={handleItalicClick}
										className={textFormatDict["italic"] ? 'pdf-redactor-tool-selected' : ''}

										><i>I</i></p>
                                </div>

                                <div className="pdf-redactor-alignment-tools">
                                    <p
										onClick={() => changeParagraphStyle("left-text-position")}
										className={currentTextPosition === "left-text-position" ? 'pdf-redactor-tool-selected' : ''}
									>L</p>
                                    <p
										onClick={() => changeParagraphStyle("central-text-position")}
										className={currentTextPosition === "central-text-position" ? 'pdf-redactor-tool-selected' : ''}
									>C</p>
                                    <p
										onClick={() => changeParagraphStyle("right-text-position")}
										className={currentTextPosition === "right-text-position" ? 'pdf-redactor-tool-selected' : ''}
									>R</p>
                                </div>

                                <div className="pdf-redactor-font-size">
									<p onClick={() => {setCurrentFontSize(currentFontSize-1)}}>-</p>
                                    <input 
                                        type="number"
										id="fontSizeInput"
                                        value={currentFontSize} 
                                        onChange={(e) => setCurrentFontSize(e.target.value)} 
                                    />
									<p onClick={() => {setCurrentFontSize(currentFontSize+1)}}>+</p>
                                </div>
                            </div>

                            <div className="pdf-redactor-page-section">
                                <div
                                    className="pdf-redactor-page" 
	                            >
									<div
										className="pdf-redactor-page-edit"
										contentEditable="true"
										ref={inputRef}
										onMouseUp={handleMouseUp}
										onKeyUp={(event) => {
											handleMouseUp(event);
											checkOverFlow(event);
										}}
										id="textField"
									>
									</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="admin-section-add-docs">
                </div>
            </div>
        </>
    );
}

