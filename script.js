// Take a Markdown Table as Input and Return an HTML Table as Output
function convertToHTML() {
    // Get the Table and split it into the induvidual Rows
    const markdown = document.getElementById('markdownInput').value.trim();
    const rows = markdown.split('\n');

    // Check if the Markdown Input is a Valid Table
    if (rows.length < 2) {
        alert('Invalid Markdown table format.');
        return;
    }
    
    // Split the Markdown Table into Header, Alignment and Content Rows
    const headers = rows[0].split('|').map(header => header.trim()).filter(header => header);
    const alignments = rows[1].split('|').map(align => align.trim()).filter(align => align);
    const bodyRows = rows.slice(2);

    // Create the Header Row
    let html = '<table border="1">\n  <thead> <tr> ';
    headers.forEach(header => { html += `<th>${header}</th> `; });
    html += '</tr> </thead>\n  <tbody>\n';

    // Create a new Line for every Content Row
    bodyRows.forEach(row => {
        // Get the Individual Cells
        const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell);

        // Create the Content Row
        html += '          <tr> ';
        cells.forEach((cell, index) => {
            const alignmentStyle = getAlignmentStyle(alignments[index]);
            // Only add the style attribute when getAlignmentStyle returns a non-null value
            html += alignmentStyle ? `<td style="${alignmentStyle}">${cell}</td> ` : `<td>${cell}</td> `;
        });
        html += '</tr>\n';
    });

    // Close the Table and print it in the HTML Text Box
    html += '  </tbody>\n</table>';
    document.getElementById('htmlInput').value = html;
    copyToClipboard(html);
}


// Take an HTML Table as Input and Return a Markdown Table as Output
function convertToMarkdown() {
    // Get the HTML Content and use a parser to get the Table
    const html = document.getElementById('htmlInput').value.trim();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const table = doc.querySelector('table');
    
    // Check if the HTML Input is a Valid Table
    if (!table) {
        alert('Invalid HTML table format.');
        return;
    }

    // Split the Table into Header and Content Rows
    const headers = table.querySelectorAll('thead th');
    const rows = table.querySelectorAll('tbody tr');

    // Take the Header Row and Create the Markdown Header and Alignment Rows
    let markdown = '| ' + Array.from(headers).map(th => th.textContent.trim()).join(' | ') + ' |\n';
    markdown += '| ' + Array.from(headers).map((th, index) => getMarkdownAlignment(th, index)).join(' | ') + ' |\n';

    // Create a new line and add the Contents for each Content Row
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        markdown += '| ' + Array.from(cells).map(td => td.textContent.trim()).join(' | ') + ' |\n';
    });

    // Print the Output in the Markdown Text Box
    document.getElementById('markdownInput').value = markdown.trim();
    copyToClipboard(markdown.trim());
}


// Check how the Column was Formatted in the Markdown Table and return the corresponding HTML Style
function getAlignmentStyle(align) {
    if (align.startsWith(':') && align.endsWith(':')) { return 'text-align: center;'; } 
    else if (align.startsWith(':')) { return 'text-align: left;'; } 
    else if (align.endsWith(':')) { return 'text-align: right;'; } 
    else { return null; }  // Return null when there's no alignment
}


// Check how the Column was Formatted in the HTML Table and Return the corresponding Markdown Style
function getMarkdownAlignment(th, index) {
    const style = th.style.textAlign;
    if (style.includes('center')) { return ':---:'; } 
    else if (style.includes('left')) { return ':---'; } 
    else if (style.includes('right')) { return '---:'; } 
    else { return '---'; } 
}


// Take an Input and put it in the System Clipboard
function copyToClipboard(content) {
    navigator.clipboard.writeText(content)
    .then(()   => { console.log('Content copied to clipboard!'); })
    .catch(err => { console.error('Could not copy text: ', err); });
}
