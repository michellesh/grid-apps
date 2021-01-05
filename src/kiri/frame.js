/** Copyright Stewart Allen <sa@grid.space> -- All Rights Reserved */

"use strict";

(function() {
    let KIRI = self.kiri = self.kiri || {};
    let frame, cwin, onevent = {};

    function $(id) { return document.getElementById(id) }

    function setFrame(fo) {
        frame = fo;
        cwin = fo.contentWindow;
    }

    function send(msg) {
        cwin.postMessage(msg);
    }

    function recv(msg) {
        let { origin, source, target, data } = msg;
        let efn = onevent[data.event];
        if (efn) {
            efn(data.data, data.event);
        }
        API.onmessage(data, msg);
    }

    let API = KIRI.frame = {
        setFrame: (io) => {
            let type = typeof(io);
            switch (type) {
                case 'string': setFrame($(io)); break;
                case 'object': setFrame(io); break;
                default: throw `invalid frame type ${type}`;
            }
            window.addEventListener('message', msg => {
                let { origin, source, target, data } = msg;
                if (source.window === cwin) {
                    recv(msg);
                }
            });
        },

        send: send,

        load: (load) => { send({ load }) },

        parse: (data) => { send({ parse })},

        get: (scope) => { send({ get: scope })},

        setMode: (mode) => { send({ mode }) },

        setDevice: (device) => { send({ device })},

        setProcess: (process) => { send({ process })},

        setFeatures: (features) => { send({ features })},

        slice: () => { send({ function: "slice" }) },

        prepare: () => { send({ function: "prepare" }) },

        export: () => { send({ function: "export" }) },

        onmessage: () => { },

        progress: (progress, message) => { send({ progress, message }) },

        alert: (alert, time) => { send({ alert, time }) },

        emit: (emit, message) => { send({ emit, message }) },

        onevent: (event, fn) => {
            onevent[event] = fn;
            send({ event });
        }
    };
})();
