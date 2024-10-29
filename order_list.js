// ==UserScript==
// @name         moje štítky
// @namespace    https://tizek.cz/
// @version      1.0
// @description  Stažení štítku.
// @author       Pavel Tížek
// @match        https://dekona.admin.s22.upgates.com/orders*
// @grant        none
// ==/UserScript==

/* global $ */
$(document).ready(function() {
    var element = "";

    if ($("#snippet--exports").length) {
        element = "#snippet--exports";
    } else if ($("#snippet-exportSection-exports").length) {
        element = "#snippet-exportSection-exports";
    } else {
        element = "#snippet-ordersGrid-rows";
    }

    var thelinkPavel = $('<a>', {
        text: 'Pavel štítky',
        title: 'go balik',
        href: '#',
        style: 'background: #ffe800;padding: 8px;margin-left: 1em;margin-bottom:9px;font-weight: bold;display: inline-block;',
        id: "href-go-balik-stitky-pavel"
    }).insertBefore(element);

    var theinput = $('<input>', {
        type: 'text',
        name: 'session-id',
        id: 'session-id',
        class: 'form-control',
        style: 'width:250px;display: inline;'
    }).insertBefore(element);

    // Načíst hodnotu z localStorage, pokud existuje a input je prázdný
    if (!$("#session-id").val() && localStorage.getItem("session-id")) {
        $("#session-id").val(localStorage.getItem("session-id"));
    }

    $('#href-go-balik-stitky-pavel').click(function(e) {
        var ids = "";
        var checkedItems = $('input[name^="bulkOperations"]:checked');

        // Pokud nejsou žádné checkboxy zaškrtnuté, vybereme všechny
        if (checkedItems.length === 0) {
            checkedItems = $('input[name^="bulkOperations"]');
        }

        checkedItems.each(function() {
            var ref_cislo = $(this).parent().next().next().next().next().find(".table-link").clone();
            ref_cislo.find('span').remove();
            ref_cislo = ref_cislo.html();

            if (!ref_cislo) {
                ref_cislo = $(this).parent().next().next().next().find(".table-link").clone();
                ref_cislo.find('span').remove();
                ref_cislo = ref_cislo.html();
            }

            if (ref_cislo && ref_cislo.trim() !== "") {
                if (ids != "") ids += ",";
                ids += ref_cislo;
            }
        });

        if (ids == "") {
            $('input[name^="editColumns"]:checked').each(function() {
                var ref_cislo = $(this).parent().next().next().next().find(".table-link").clone();
                ref_cislo.find('span').remove();
                ref_cislo = ref_cislo.html();

                if (ref_cislo && ref_cislo.trim() !== "") {
                    if (ids != "") ids += ",";
                    ids += ref_cislo;
                }
            });
        }

        if (ids == "") {
            alert("Není vybraná žádná objednávka.");
        } else {
            e.preventDefault();

            // Získat hodnotu sessionId a uložit do localStorage
            var sessionId = $("#session-id").val();
            if (sessionId) {
                localStorage.setItem("session-id", sessionId);
            }

            var url = "https://short-martynne-pavel-1fc5cfc6.koyeb.app/convert_pdf?id_orders=" + ids +
                "&start_position=" + $("#go-balik-pozice-tisk").val() +
                (sessionId ? ("&session=" + sessionId) : "");

            window.open(url, '_blank');
        }
    });
});
