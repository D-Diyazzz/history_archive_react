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

function getLineWithDots(title, pageNum, containerWidth = 600, font = '16px Arial') {
  // Создаём «виртуальный» canvas для измерения ширины
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = font;

  // Преобразуем номер в строку (на всякий случай)
  const pageStr = String(pageNum);

  // Измеряем ширину заголовка, номера и одной точки
  const titleChanged = title.replace("&nbsp;&nbsp;&nbsp;&nbsp;", "    ") 
  const titleWidth = ctx.measureText(titleChanged).width;
  const pageWidth  = ctx.measureText(pageStr).width;
  const dotWidth   = ctx.measureText('.').width;

  const textHeight = ctx.measureText(title).actualBoundingBoxAscent + ctx.measureText(title).actualBoundingBoxDescent;

  console.log('Ширина:', titleWidth);
  console.log('Высота:', textHeight);


  // Сколько пикселей остаётся под точки
  const freeSpace = containerWidth - (titleWidth % containerWidth) - pageWidth;

  if (freeSpace <= 0) {
    // Места совсем нет — возвращаем хоть что-то
    return `${title} ${pageStr}`;
  }

  // Считаем, сколько точек поместится
  const dotsCount = Math.floor(freeSpace / dotWidth);

  // Генерируем строку из нужного количества точек
  const dots = '.'.repeat(dotsCount);

  // Склеиваем
  return `${title}${dots}${pageStr}`;
}

/**
 * Создаём <span> с уже готовым текстом вида "Заголовок...Страница".
 * Можно доработать стили и классы по желанию.
 */
function createSingleSpanLine(title, pageNum) {
  // Шрифт и ширину настраиваем здесь
  const containerWidth = 600;
  const font = '16px Arial';

  const span = document.createElement('span');
  // Получаем итоговую строку
  const finalText = getLineWithDots(title, pageNum, containerWidth, font);
  span.innerHTML = finalText;
  
  // Пример минимальных стилей (или переопределяйте классами):
  span.style.font = font;
  // Можно добавить класс:
  // span.classList.add('size-16', 'bold');

  return span;
}


export const renderHeadingPageNum = (pageNumDict) => {
	const headingPageNumBlock = document.querySelectorAll('.pdf-redactor-page-heading-num-edit');
	const elementsQue = new FIFOQueue();

	Object.keys(pageNumDict).forEach(id => {
	  Object.keys(pageNumDict[id]).forEach(key => {
		// 1) Создаём параграф для заголовка (h1)
		const h1elem = document.createElement('p');
		h1elem.className = "left_parPosition parHeadingPageNum";

		// Вместо 3 спанов – один
		const singleSpan = createSingleSpanLine(
		  key,                                     // Заголовок
		  pageNumDict[id][key]['pageNum']          // Номер страницы
		);
		h1elem.appendChild(singleSpan);
		
		elementsQue.enqueue(h1elem);

		// 2) Обрабатываем подзаголовки
		pageNumDict[id][key]['subHeadings'].forEach(obj => {
		  const h2elem = document.createElement('p');
		  h2elem.className = "left_parPosition parHeadingPageNum";

		  // Для подзаголовков можно добавить отступы в начале:
		  const indentedTitle = `&nbsp;&nbsp;&nbsp;&nbsp;${obj['textContent']}`;
		  const subSpan = createSingleSpanLine(
			indentedTitle,
			obj['pageNum']
		  );
		  h2elem.appendChild(subSpan);

		  elementsQue.enqueue(h2elem);
		});
	  });
	});

	console.log(elementsQue);
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

