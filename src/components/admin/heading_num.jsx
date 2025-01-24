import { FIFOQueue } from "../../utils/queue";

export const handleCreateHeadingNumerationBlock = (range, handleMouseUp, checkOverFlow, handleEditPage, handleFileChange) => {
	const pageBlockNode = range.startContainer;

	// Находим родительский узел с классом "pdf-redactor-page-block"
	let currentPageBlockNode = pageBlockNode;
	while (currentPageBlockNode.className !== "pdf-redactor-page-block") {
		currentPageBlockNode = currentPageBlockNode.parentNode;
	}

	const originNode = currentPageBlockNode.parentNode;

	// Создаём новый div
	const newDiv = document.createElement("div");
	newDiv.contentEditable = "true";
	newDiv.className = "pdf-redactor-page-heading-num-edit";
	newDiv.setAttribute("id", "textField");
	newDiv.addEventListener("mouseup", handleMouseUp);
	newDiv.addEventListener("oninput", handleEditPage);
	newDiv.addEventListener("keyup", (event) => {
		handleMouseUp(event);
		checkOverFlow(null);
	});

	const newParentDiv = document.createElement("div");
	newParentDiv.className = "pdf-redactor-page";
	newParentDiv.appendChild(newDiv);

	const newParentDivBlock = document.createElement("div");
	newParentDivBlock.className = "pdf-redactor-page-block";
	const tools = currentPageBlockNode.lastChild.cloneNode(true);
	tools.addEventListener("onChange", handleFileChange);

	newParentDivBlock.appendChild(newParentDiv);
	newParentDivBlock.appendChild(tools);

	// Вставляем newParentDivBlock после currentPageBlockNode
	if (currentPageBlockNode.nextSibling) {
		originNode.insertBefore(newParentDivBlock, currentPageBlockNode.nextSibling);
	} else {
		originNode.appendChild(newParentDivBlock);
	}
	
	trackingHeadingPageNum()

}


export const trackingHeadingPageNum = () => {
	const allBlocks = document.querySelectorAll('.pdf-redactor-page-block'); // Находим все блоки pdf-redactor-page-block
  	const result = [];

	let keyH1 = "";
	let valuesH2 = [];
	let keyH1Page = 0;

	allBlocks.forEach((block, index) => {
    	const editBlock = block.querySelector('.pdf-redactor-page-edit'); // Ищем блок pdf-redactor-page-edit внутри текущего блока
    	if (editBlock) {
      		const paragraphs = editBlock.querySelectorAll('p'); // Находим все параграфы в этом блоке
			paragraphs.forEach(p => {
				console.log(p.className.split(" "))
				console.log(p.className.split(" ").includes("heading_type"))
				if(p.className.split(" ").includes("heading_type") && keyH1 != ""){
					result.push({
						[keyH1]:{
							pageNum: index+1,
							subHeadings: valuesH2
						}
					})
					keyH1 = p.textContent
					keyH1Page = index+1
					valuesH2 = []
				}else if(p.className.split(" ").includes("heading_type") && keyH1 == ""){
					keyH1 = p.textContent
				}
				else if(p.className.split(" ").includes("subHeading_type")){
					valuesH2.push({
						textContent: p.textContent,
						pageNum: index+1
					})
				}
			})

    	}
		if(index == allBlocks.length-1){
			result.push({
				[keyH1]:{
					pageNum: keyH1Page,
					subHeadings: valuesH2
				}
			})
		}
  	});

 	console.log(result);
	renderHeadingPageNum(result)
	return result; 	
}

const adjustDots = (paragraph) => {
    // Находим все span внутри параграфа
    const spans = paragraph.querySelectorAll('span');

    // Предполагаем, что первый span — title, второй — dots, третий — page
    const spanTitle = spans[0];
    const spanDots = spans[1];
    const spanPage = spans[2];

    // Если один из элементов отсутствует, прекращаем выполнение
    if (!spanTitle || !spanDots || !spanPage) return;

    // Вычисляем ширину доступного пространства
    const totalWidth = paragraph.clientWidth;
    const titleWidth = spanTitle.offsetWidth;
    const pageWidth = spanPage.offsetWidth;

    const availableWidth = totalWidth - titleWidth - pageWidth;
	console.log(spanTitle.offsetWidth)

    // Если есть доступное пространство, сокращаем точки
    const dotWidth = spanDots.offsetWidth / spanDots.textContent.length;
    const numDots = Math.floor(availableWidth / dotWidth);

    if (numDots > 0) {
        spanDots.textContent = '.'.repeat(numDots);
    } else {
        spanDots.textContent = ''; // Если места нет, удаляем точки
    }
};

export const renderHeadingPageNum = (pageNumDict) => {
	const headingPageNumBlock = document.querySelectorAll('.pdf-redactor-page-heading-num-edit')

	const elementsQue = new FIFOQueue()

	Object.keys(pageNumDict).forEach(id => {
		Object.keys(pageNumDict[id]).forEach(key => {
			const h1elem = document.createElement('p')
			h1elem.className = "left_parPosition parHeadingPageNum"
			
			const spanTitle = document.createElement('span');
			const spanDots = document.createElement('span');
			const spanPage = document.createElement('span');
			
			const spanClass = 'size-16 bold'

			spanTitle.className = `${spanClass}`
			spanDots.className = `${spanClass} spanDots`
			spanPage.className = `${spanClass}`

			spanTitle.style.fontSize = '16px'
			spanTitle.style.height = '16px'
			spanTitle.style.display = 'inline-block'

			spanDots.style.fontSize = '16px'
			spanDots.style.height = '16px'
			spanDots.style.display = 'inline-block'

			spanPage.style.fontSize = '16px'
			spanPage.style.height = '16px'
			spanPage.style.display = 'inline-block'
			
			spanTitle.textContent = key
			spanPage.textContent = pageNumDict[id][key]['pageNum']
			spanDots.textContent = ".........................................................................................................................................................."

			h1elem.appendChild(spanTitle)
			h1elem.appendChild(spanDots)
			h1elem.appendChild(spanPage)

			elementsQue.enqueue(h1elem)

			pageNumDict[id][key]['subHeadings'].forEach(obj => {
				const h2elem = document.createElement('p');
				h2elem.className = "left_parPosition parHeadingPageNum";

				const subSpanTitle = document.createElement('span');
				const subSpanDots = document.createElement('span');
				const subSpanPage = document.createElement('span');

				subSpanTitle.className = `${spanClass}`;
				subSpanDots.className = `${spanClass} spanDots`
				subSpanPage.className = `${spanClass}`;

				subSpanTitle.style.fontSize = '16px';
				subSpanTitle.style.height = '16px';
				subSpanTitle.style.display = 'inline-block';

				subSpanDots.style.fontSize = '16px';
				subSpanDots.style.height = '16px';
				subSpanDots.style.display = 'inline-block';

				subSpanPage.style.fontSize = '16px';
				subSpanPage.style.height = '16px';
				subSpanPage.style.display = 'inline-block';
			
				subSpanTitle.style.whiteSpace = 'pre';
				subSpanTitle.textContent = `    ${obj['textContent']}`;
				// subSpanTitle.innerHTML = `&nbsp;&nbsp;&nbsp;&nbsp;${obj['textContent']}`;
				subSpanPage.textContent = obj['pageNum'];
				subSpanDots.textContent = ".........................................................................................................................................................."

				h2elem.appendChild(subSpanTitle);
				h2elem.appendChild(subSpanDots);
				h2elem.appendChild(subSpanPage);

				elementsQue.enqueue(h2elem);
			})

		})
		
	})

	console.log(elementsQue)

	// headingPageNumBlock.forEach(block => {
	// 	while(block.firstChild){
	// 		block.removeChild(block.firstChild)
	// 	}	
	//
	// 	elementsQue.forEach(elem => {
	// 		block.appendChild(elem)
	// 	})
	// })

	let parToTranspose = null;
	const parentNode = Array.from(headingPageNumBlock[0].parentNode)

	for(let i=0; i<headingPageNumBlock.length; i++){
		while(headingPageNumBlock[i].firstChild){
			headingPageNumBlock[i].removeChild(headingPageNumBlock[i].firstChild)
			if(parToTranspose !== null){
				headingPageNumBlock[i].appendChild(parToTranspose)
				parToTranspose = null
			}
		}
	
		while(!elementsQue.isEmpty()){
			const elementToAppend = elementsQue.dequeue()
			headingPageNumBlock[i].appendChild(elementToAppend)
			const isOverFlow = checkOverFlowHedingPageNum(headingPageNumBlock[i])
			if(
				isOverFlow === true &&
				parentNode.indexOf(headingPageNumBlock[i])+1 == parentNode.indexOf(headingPageNumBlock[i+1])){
				
				parToTranspose = elementToAppend
				break;
			} else if (
				isOverFlow === true &&
				parentNode.indexOf(headingPageNumBlock[i])+1 != parentNode.indexOf(headingPageNumBlock[i+1])){
					
				headingPageNumBlock = document.querySelectorAll(".pdf-redactor-page-heading-num-edit")
				parToTranspose = elementToAppend
				break;
			}
			
		}

	}
}

	const checkOverFlowHedingPageNum = (PurposeDiv) => {
		console.log(2)
		const selection = window.getSelection();
		const range = selection.getRangeAt(0);

		let divNode = range.startContainer;

		if(PurposeDiv != null){
			divNode = PurposeDiv
		}else{

			while(divNode.className !== "pdf-redactor-page-heading-num-edit" && divNode.nodeName !== "DIV"){
				divNode = divNode.parentNode
			}
		}


		const parrentDiv = divNode.parentNode;
		const parrentDivBlock = parrentDiv.parentNode
		const originNode = parrentDiv.parentNode.parentNode;
		const style = getComputedStyle(parrentDiv);
		const paddingTop = parseFloat(style.paddingTop);
		const paddingBottom = parseFloat(style.paddingBottom);
		const contentHeight = parrentDiv.clientHeight - paddingTop - paddingBottom
		
		const cursorPos = range.startOffset;
		if(divNode.scrollHeight >= contentHeight){
			let nextDiv = 0;
				
			while(originNode.childNodes[nextDiv].firstChild !== parrentDiv){
				nextDiv += 1;
				console.log(nextDiv)
			}
			nextDiv += 1;
			nextDiv = originNode.childNodes[nextDiv].firstChild.firstChild
			

			let lastP = divNode.lastChild
			while(lastP.nodeName !== "P"){
				lastP = lastP.lastChild
			}
			console.log(lastP)

			const pToTranspose = lastP.cloneNode(true)
			console.log(pToTranspose)
			
			if(originNode.lastChild === parrentDivBlock || nextDiv.className != "pdf-redactor-page-heading-num-edit"){
				console.log(123)
				const newDiv = document.createElement("div");
				newDiv.contentEditable = "true"
				newDiv.className = "pdf-redactor-page-heading-num-edit"
				newDiv.setAttribute("id", "textField");
				newDiv.addEventListener('mouseup', handleMouseUp);
				newDiv.addEventListener('keyup', (event) => {
					handleMouseUp(event);
					checkOverFlowHedingPageNum(null);
				});
				newDiv.addEventListener('oninput', handleEditPage);


				console.log(newDiv)

				const newParrentDiv = document.createElement("div")
				newParrentDiv.className = "pdf-redactor-page"
				newParrentDiv.appendChild(newDiv)

				const newParrentDivBlock = document.createElement("div")
				newParrentDivBlock.className = "pdf-redactor-page-block"
				const tools = parrentDivBlock.lastChild.cloneNode(true)
				tools.addEventListener("onChange", handleFileChange)

				newParrentDivBlock.appendChild(newParrentDiv)
				newParrentDivBlock.appendChild(tools)

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
				
				nextDiv.insertBefore(pToTranspose, nextDiv.firstChild)
				console.log("remove")

				lastP.remove()


				checkOverFlow(divNode)
				checkOverFlow(nextDiv)
			}
			updatePageNumbers()
			return true
		}else{
			return false
		}
	}

