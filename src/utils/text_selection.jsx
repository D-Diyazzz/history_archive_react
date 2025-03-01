function getAllSpans(root, result = []) {
  // Если этот узел сам span, добавляем
  if (root.nodeName.toLowerCase() === 'span') {
    result.push(root);
  }

  // Рекурсивно обходим дочерние элементы
  for (let i = 0; i < root.childNodes.length; i++) {
    const child = root.childNodes[i];
    // Если это элемент (nodeType === 1), идём вглубь
    if (child.nodeType === 1) {
      getAllSpans(child, result);
    }
  }

  return result;
}


export const MouseUpTextSelectionHandler = () => {
	console.log(1)

	const selection = window.getSelection()
	const range = selection.getRangeAt(0);

	if(range.startOffset == range.endOffset){
		return NaN
	}

	const fragment = range.cloneContents();
	const spans = fragment.querySelectorAll('span');
	console.log(spans)

	// const allSpans = getAllSpans(document.body);
	// console.log(allSpans.map(span => span.outerHTML));
}
