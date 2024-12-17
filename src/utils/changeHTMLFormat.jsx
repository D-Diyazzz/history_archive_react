import { FIFOQueue } from "./queue";


export const changeHTMLToPdfHtmlFormat = (text) => {

    const tempElement = document.createElement('div');
    tempElement.innerHTML = text;

    const paragraphs = tempElement.querySelectorAll('p');
	return paragraphs

}

const briefContentToHtmlCollectionFormat = (text) => {
	const tempElement = document.createElement('div');
	tempElement.innerHTML = text;

	const paragraph = tempElement.querySelector('p');
	paragraph.className = 'central-text-position';
	paragraph.style.fontSize = '16px';
	paragraph.style.height = '16px';
	paragraph.style.display = 'inline-block'

	return paragraph
}

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
        const authorP = createParagraph(doc.author, 'right-text-position');
        listP.push(authorP);
    }

    // Условие для doc.dating
    if (doc.dating != null && doc.dating !== '-') {
        const datingP = createParagraph(doc.dating, 'right-text-position');
        listP.push(datingP);
    }

    // Условие для doc.place_of_creating
    if (doc.place_of_creating != null && doc.place_of_creating !== '-') {
        const placeP = createParagraph(doc.place_of_creating, 'right-text-position');
        listP.push(placeP);
    }

    // Условие для doc.variety
    if (doc.variety != null && doc.variety !== '-') {
        const varietyP = createParagraph(doc.variety, 'right-text-position');
        listP.push(varietyP);
    }

	return listP;
}

export const documentForCollectionFormat = (doc) => {
	const queue = new FIFOQueue()
	
	const briefContentP = briefContentToHtmlCollectionFormat(doc.brief_content)
	console.log('briefContentP')
	queue.enqueue(briefContentP);
	
	const metadataPList = metadataToHtmlCollectionFormat(doc);

	metadataPList.forEach((p) => {
		queue.enqueue(p)
	})

	const mainTextPList = changeHTMLToPdfHtmlFormat(doc.main_text)
	
	mainTextPList.forEach((p) => {
		p.className = 'left-text-position'
		queue.enqueue(p)
	})

	return queue;
}
