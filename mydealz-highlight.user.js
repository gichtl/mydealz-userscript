// ==UserScript==
// @name         Mydealz Highlight Non-Kostenlos
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Highlights spans with shipping costs
// @author       Your Name
// @match        https://www.mydealz.de/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function parsePrice(text) {
        const cleanedText = text.replace(/[^\d,]/g, '').replace(',', '.');
        return parseFloat(cleanedText) || null;
    }

    function checkAndStyleSpans() {
        //const spans = document.querySelectorAll('span.overflow--wrap-off.size--all-s');
        const spans = document.querySelectorAll('span.overflow--fade');

        // Loop through each span
        spans.forEach(span => {
            const priceElement = span.querySelector('span.threadItemCard-price');
            const shippingElement = span.querySelector('span.overflow--wrap-off.size--all-s');

            if (priceElement && shippingElement && !span.dataset.processed) {
                const priceText = priceElement.textContent.trim();
                const shippingText = shippingElement.textContent.trim();

                const price = parsePrice(priceText);
                const shipping = parsePrice(shippingText);

                if (price !== null && shipping !== null) {

                    const total = price + shipping;

                    shippingElement.style.fontWeight = 'bold';
                    shippingElement.style.color = 'white';
                    shippingElement.style.backgroundColor = 'red';
                    shippingElement.style.fontSize = '1.2rem';

                    const totalElement = document.createElement('span');
                    totalElement.textContent = ` ${total.toFixed(2).replace('.', ',')}€`;
                    totalElement.style.color = 'white';
                    totalElement.style.fontWeight = 'bold';
                    totalElement.style.backgroundColor = 'green';
                    totalElement.style.padding = '0 5px';
                    totalElement.style.marginLeft = '10px';
                    totalElement.style.fontSize = '1.2rem';

                    shippingElement.parentNode.appendChild(totalElement);

                    span.dataset.processed = 'true';
                }
            }
        });
    }

    // Run the function when the page loads
    window.addEventListener('load', checkAndStyleSpans);

    // Also run the function when new content is loaded (e.g., via AJAX)
    const observer = new MutationObserver(checkAndStyleSpans);
    observer.observe(document.body, { childList: true, subtree: true });
})();