// ==UserScript==
// @name         moje štítky
// @namespace    https://tizek.cz/
// @version      1.1
// @description  Stažení štítku pomocí API.
// @author       Pavel Tížek
// @match        https://dekona.admin.s22.upgates.com/orders*
// @grant        none
// ==/UserScript==

/* global $ */
$(document).ready(function () {

    if ($("#snippet--exports").length) {
        element = "#snippet--exports";
    } else if ($("#snippet-exportSection-exports").length) {
        element = "#snippet-exportSection-exports";
    } else {
        element = "#snippet-ordersGrid-rows";
    }

    $('<a>', {
        text: 'Pavel štítky',
        title: 'go balik',
        href: '#',
        style: 'background: #ffe800;padding: 8px;margin-left: 1em;margin-bottom:9px;font-weight: bold;display: inline-block; color: #000;',
        id: "href-go-balik-stitky-pavel"
    }).insertBefore(element);

    $('#href-go-balik-stitky-pavel').click(function (e) {
        e.preventDefault();
        var ids = [];
        var checkedItems = $('input[name^="bulkOperations"]:checked');

        // Pokud nejsou žádné checkboxy zaškrtnuté, vybereme všechny
        if (checkedItems.length === 0) {
            checkedItems = $('input[name^="bulkOperations"]');
        }

        checkedItems.each(function () {
            var ref_cislo = $(this).parent().next().next().next().next().find(".table-link").clone();
            ref_cislo.find('span').remove();
            ref_cislo = ref_cislo.html();

            if (!ref_cislo) {
                ref_cislo = $(this).parent().next().next().next().find(".table-link").clone();
                ref_cislo.find('span').remove();
                ref_cislo = ref_cislo.html();
            }

            if (ref_cislo && ref_cislo.trim() !== "") {
                ids.push(ref_cislo.trim());
            }
        });

        if (ids.length === 0) {
            $('input[name^="editColumns"]:checked').each(function () {
                var ref_cislo = $(this).parent().next().next().next().find(".table-link").clone();
                ref_cislo.find('span').remove();
                ref_cislo = ref_cislo.html();

                if (ref_cislo && ref_cislo.trim() !== "") {
                    ids.push(ref_cislo.trim());
                }
            });
        }

        if (ids.length === 0) {
            alert("Není vybraná žádná objednávka.");
            return;
        }

        // Vytvoření Blob objektu pro zobrazení PDF inline
        fetch('https://monster.tizeklab.cz//pdf/convert_pdf_api?start_position=' + $("#go-balik-pozice-tisk").val(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ids: ids
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob();
            })
            .then(blob => {
                // Vytvoření URL pro zobrazení PDF
                const url = window.URL.createObjectURL(blob);
                // Otevření PDF v novém okně (záložce)
                window.open(url, '_blank');
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Chyba při zobrazení štítků: ' + error.message);
            });

    });
});
