import { FIFOQueue } from "./queue";




const processNode = (node, inheritedClasses = [], fontSize=12) => {

	 const tagToClassMap = {
        strong: 'bold',
        i: 'italica',
    };
        // Если это текстовый узел, возвращаем его как есть
        if (node.nodeType === Node.TEXT_NODE) {
            return document.createTextNode(node.nodeValue);
        }

		const computedStyle = window.getComputedStyle(node); // Получаем все примененные стили
		const nodeFontSize = computedStyle.fontSize.replace("px", ""); // Получаем размер шрифта
		if(nodeFontSize != ""){
			fontSize = nodeFontSize
		}
	
		const span = document.createElement('span');
		span.className = [...inheritedClasses, `size-${fontSize}`].join(' ');
		span.style.fontSize = `${fontSize}px`;

        // Если тег есть в таблице соответствий
        if (tagToClassMap[node.tagName?.toLowerCase()]) {
            const className = tagToClassMap[node.tagName.toLowerCase()];
            span.className = [...span.className.split(' ').filter(Boolean), className].join(' ');


        }

		// Обрабатываем дочерние узлы
		node.childNodes.forEach(child => {
			span.appendChild(processNode(child, span.className));
		});

		return span;

};

const processTextNode = (node, fontSize=12) => {
	const span = document.createElement('span');
	span.className = `size-${fontSize}`;
	span.style.fontSize = `${fontSize}px`;

	span.appendChild(node)

	return span
}

const briefContentToHtmlCollectionFormat = (text, fontSize) => {
   
    // Создаем временный элемент для парсингаTML
    const tempElement = document.createElement('div');
    tempElement.innerHTML = text;

    // Обрабатываем параграфы
    const paragraphs = tempElement.querySelectorAll('p');
    paragraphs.forEach(paragraph => {
        const newContent = [];
        paragraph.childNodes.forEach(child => {
			if(child.nodeType === Node.TEXT_NODE){
				console.log("node et")
				newContent.push(processTextNode(child,fontSize))
			}else{
            	newContent.push(processNode(child, [],fontSize));
			}
        });

        // Заменяем содержимое параграфа
        paragraph.innerHTML = '';
        newContent.forEach(node => paragraph.appendChild(node));
    });

    return tempElement.querySelectorAll('p'); // Возвращаем преобразованный <p>
};


const metadataToHtmlCollectionFormat = (doc) => {
	const newSpanClass = ['size-12 italic'];
    const listP = [];

	const createParagraph = (text, className) => {
        const paragraph = document.createElement('p');
        paragraph.className = className;

        const newSpan = document.createElement('span');
        newSpan.classList = `${newSpanClass}`;
        newSpan.style.fontSize = '12px';
        newSpan.style.height = '12px';
        newSpan.style.display = 'inline-block';

        const textNode = document.createTextNode(text);
        newSpan.appendChild(textNode);
        paragraph.appendChild(newSpan);

        return paragraph;
    };

    // Условие для doc.author
    if (doc.author != null && doc.author !== '-') {
        const authorP = createParagraph(doc.author, 'right_parPosition');
        listP.push(authorP);
    }

    // Условие для doc.dating
    if (doc.dating != null && doc.dating !== '-') {
        const datingP = createParagraph(doc.dating, 'right_parPosition');
        listP.push(datingP);
    }

    // Условие для doc.place_of_creating
    if (doc.place_of_creating != null && doc.place_of_creating !== '-') {
        const placeP = createParagraph(doc.place_of_creating, 'right_parPosition');
        listP.push(placeP);
    }

    // Условие для doc.variety
    if (doc.variety != null && doc.variety !== '-') {
        const varietyP = createParagraph(doc.variety, 'right_parPosition');
        listP.push(varietyP);
    }

	return listP;
}

export const documentForCollectionFormat = (doc) => {
	const queue = new FIFOQueue()
	
	const briefContentP = briefContentToHtmlCollectionFormat(doc.brief_content, 16)
	console.log('briefContentP')
	briefContentP.forEach((p) => {
		p.className = "central_parPosition heading_type"
		queue.enqueue(p)
	})
	
	const metadataPList = metadataToHtmlCollectionFormat(doc);

	metadataPList.forEach((p) => {
		queue.enqueue(p)
	})

	const mainTextPList = briefContentToHtmlCollectionFormat(doc.main_text, 12)
	
	mainTextPList.forEach((p) => {
		p.className = 'left_parPosition'
		queue.enqueue(p)
	})

	return queue;
}
