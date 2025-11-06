// ==UserScript==
// @name Desbloqueador VIP do Ident
// @namespace http://tampermonkey.net/
// @version 1.0
// @description Porque pagar por aulas quando dá pra clicar e rir da cara do cadeado?
// @author Você
// @match https://www.ident.com.br/*
// @grant none
// @run-at document-start
// ==/UserScript==
(function() {
    'use strict';
    setTimeout(() => {
        (() => {
            if (window.Videos && Videos.Player && Videos.Player.playlist) {
                const pl = Videos.Player.playlist;
                pl.forEach((item, i) => {
                    if (item.action) {
                        console.log(`Removendo action do item ${i}:`, item.action);
                        delete item.action;
                    }
                });
                console.log(`✅ Ações removidas. Total de itens: ${pl.length}`);
            } else {
                console.warn("❌ Playlist não encontrada. Verifique se Videos.Player.playlist existe.");
            }
        })();
    (() => {
        const anchors = Array.from(document.querySelectorAll('a.chapter[href^="javascript:_rq"]'));
        let count = 0;
        anchors.forEach((a, i) => {
            const href = a.getAttribute('href');
            if (href && href.includes("javascript:_rq('Videos', 'requireLoginOrPurchase'")) {
                const newIndex = i + 1;
                const newHref = `javascript:_rq('Videos', ['Player','play'], ['${newIndex}']);`;
                a.setAttribute('href', newHref);
                count++;
                console.log(`Atualizado link ${i}:`, newHref);
            }
        });
        console.log(`✅ ${count} links atualizados com sucesso.`);
    })();
    require(['Videos'], function(Videos) {
        if (!Videos.Player) {
            console.warn('Player não encontrado dentro do módulo Videos');
            return;
        }
        const originalPlay = Videos.Player.play;
        Videos.Player.play = function(index) {
            try {
                const item = this.playlist ? this.playlist[index] : null;
                if (item && item.action) {
                    console.warn('Ignorando ação e tocando o vídeo diretamente:', item);
                    const originalAction = item.action;
                    delete item.action;
                    const result = originalPlay.apply(this, arguments);
                    item.action = originalAction;
                    return result;
                }
                return originalPlay.apply(this, arguments);
            } catch (err) {
                console.error('Erro ao tentar ignorar ação:', err);
                return originalPlay.apply(this, arguments);
            }
        };
        console.log('%cModificação aplicada: o player agora ignora ações e toca o vídeo diretamente.', 'color: orange; font-weight: bold;');
    });
}, 10000);

})();