// ==UserScript==
// @name         Přidání ikony u objednávek s dobírkou
// @namespace    http://example.com/
// @version      1.0
// @description  Přidá ikonu do sloupce objednávky, pokud se v poli doprava a platba nachází slovo "dobírka".
// @author       Pavel Tížek
// @match        https://dekona.admin.s22.upgates.com/orders*
// @grant        none
// ==/UserScript==

/* global $ */
$(document).ready(function () {
    $('tr[data-row_id]').each(function () {
        var $row = $(this);
        var shipmentText = $row.find('.col-shipment_payment').text().toLowerCase();
        if (shipmentText.indexOf('dobírka') !== -1) {
            // Vytvoření elementu ikony – zde se používá Font Awesome ikona, ale můžete použít libovolnou.
            var $icon = $('<i>', {
                class: 'fa fa-money-bill text-danger',
                css: { marginLeft: '5px' },
                title: 'Dobírka'
            });
            // Přidáme ikonu za obsah v buňce objednávky
            $row.find('.col-order_number').append($icon);
        }
    });
});
