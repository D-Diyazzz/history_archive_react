function getAllSpans(root, startSpan, endSpan, startOriginNode, endOriginNode, result = []) {

	const spans = Array.from(root.querySelectorAll('span'));
	
	if(root == startOriginNode && root != endOriginNode){
		const startSpanIndex = spans.indexOf(startSpan)


		for(let i=startSpanIndex; i<spans.length; i++){
			result.push(spans[i])
		}
		
	}else if(root == startOriginNode && root == endOriginNode){
		const startSpanIndex = spans.indexOf(startSpan)	
		const endSpanIndex = spans.indexOf(endSpan)

		for(let i=startSpanIndex; i<=endSpanIndex; i++){
			result.push(spans[i])
		}

		return result;
	}else if(root != startOriginNode && root != endOriginNode){
		spans.forEach((item, index) => {
			result.push(item)
		})
	}else if(root == endOriginNode && root != startOriginNode){
		const endSpanIndex = spans.indexOf(endSpan)

		for(let i=0; i<=endSpanIndex; i++){
			result.push(spans[i])
		}
		return result;
	}
	getAllSpans(root.nextElementSibling, startSpan, endSpan, startOriginNode, endOriginNode, result)

  	return result;
}


export const MouseUpTextSelectionHandler = (range, type, startOffset, endOffset) => {

	let startOriginNode = range.startContainer;
	while(startOriginNode.className != "pdf-redactor-page-block"){
		startOriginNode = startOriginNode.parentNode
	}

	let endOriginNode = range.endContainer;
	while(endOriginNode.className != "pdf-redactor-page-block"){
		endOriginNode = endOriginNode.parentNode
	}

	let startSpan = range.startContainer;
	while(startSpan.nodeName != "SPAN"){
		startSpan = startSpan.parentNode
	}

	const parentStartSpan = startSpan.parentNode;
	const children = Array.from(parentStartSpan.children);
	const startSpanIndex = children.indexOf(startSpan);

	let endSpan = range.endContainer
	while(endSpan.nodeName != "SPAN"){
		endSpan = endSpan.parentNode
	}


	const spans = getAllSpans(startOriginNode, startSpan, endSpan, startOriginNode, endOriginNode)

	if(type == "deleteContentBackward"){
		deleteEventTextSelection(range, spans, startOffset, endOffset)
	}
}


export const removeTextFromSpan = (spanElement, start, end)=>{
	console.log(start, end)
	const originalText = spanElement.textContent || '';
	const length = originalText.length;

	const clampedStart = Math.max(0, Math.min(start, length));
	const clampedEnd = Math.max(clampedStart, Math.min(end, length));

	if(clampedStart == 0 && clampedEnd == length){
		spanElement.parentNode.removeChild(spanElement);
	} else{
		const newText = originalText.slice(0, clampedStart) + originalText.slice(clampedEnd);
		console.log(originalText)
		console.log(newText)
		spanElement.textContent = newText;
	}
}


export const deleteEventTextSelection = (range, spans, startOffset, endOffset) => {
	console.log(startOffset, endOffset)
	if(spans.length == 1){
		removeTextFromSpan(range.startContainer, startOffset, endOffset)
	}else{
		spans.forEach((span, index) => {
			console.log(index, span)
			if(index == 0){
				console.log("if")
				removeTextFromSpan(span, startOffset, span.textContent.length)	
			}else if(index == spans.length - 1){
				console.log("elif")
				removeTextFromSpan(span, 0, endOffset);
			}else{
				console.log("else")
				span.parentNode.removeChild(span)
			}	
		})
	}
	console.log(range.startContainer)

	range.setStart(spans[0].firstChild, startOffset)
	range.setEnd(spans[0].firstChild, startOffset)
}
