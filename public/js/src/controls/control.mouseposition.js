/*
Copyright 2012 Ardhi Lukianto

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// app.MapPane.mousepositionControl

L.Control.Mouseposition = Wu.Control.extend({

        type : 'mouseposition',

        options: {
                position: 'topright',
                separator: ',  ',
                emptyString: 'Lat/Lng',
                lngFirst: false,
                numDigits: 3,
                lngFormatter: this.formatNum,
                latFormatter: this.formatNum,
                prefix: "",
                zoomLevel : true
        },

        _on : function () {
                this._show();
        },
        _off : function () {
                this._hide();
        },
        _show : function () {
                this._container.style.display = 'inline-block';
        },
        _hide : function () {
                this._container.style.display = 'none';
        },

        _addTo : function () {
                this.addTo(app._map);
                this._added = true;

        },

        _refresh : function () {
                // should be active
                if (!this._added) this._addTo();

                // get control active setting from project
                var active = this._project.getControls()[this.type];
                
                // if not active in project, hide
                if (!active) return this._hide();

                // remove old content
                this._flush();
        },

        _flush : function () {

        },


        onAdd: function (map) {
                this._map = map;

                this._container = L.DomUtil.create('div', 'leaflet-control-mouseposition');
                this._container.innerHTML = this.options.emptyString;
                
                L.DomEvent.disableClickPropagation(this._container);
              
                map.on('mousemove', this._onMouseMove, this);
               
                if (this.options.zoomLevel) {
                        map.on('zoomend', this._updateZoom, this);
                        this._updateZoom();
                }                

                // add tooltip
                app.Tooltip.add(this._container, 'Gives the coordinates of the mouse pointer', { extends : 'systyle', tipJoint : 'bottom middle'});

                return this._container;
        },

        _updateZoom : function () {
                this._zoom = this._map.getZoom();
        },

        onRemove: function (map) {
                map.off('mousemove', this._onMouseMove, this);
               
                if (this.options.zoomLevel) map.off('zoomend', this._updateZoom, this);
        },

        _onMouseMove: function (e) {
                // var lng = this.options.lngFormatter ? this.options.lngFormatter(e.latlng.lng) : L.Util.formatNum(e.latlng.lng, this.options.numDigits);
                // var lat = this.options.latFormatter ? this.options.latFormatter(e.latlng.lat) : L.Util.formatNum(e.latlng.lat, this.options.numDigits);
                
                var lng = this.formatNum(e.latlng.lng, this.options.numDigits);
                var lat = this.formatNum(e.latlng.lat, this.options.numDigits);

                var value = this.options.lngFirst ? lng + this.options.separator + lat : lat + this.options.separator + lng;
                var prefixAndValue = this.options.prefix + ' ' + value;
                if (this.options.zoomLevel) prefixAndValue += ',  ' + this._zoom;
                this._container.innerHTML = prefixAndValue;
        },

        formatNum : function (num, digits) {
                // L.Util.formatNum
                var pow = Math.pow(10, digits || 5);
                var value = Math.round(num * pow) / pow;

                // force num of digits (add 0's)
                var splitValue = value.toString().split('.');
                var d = splitValue[1];
                if (!d) return '';
                var diff = digits - d.length;
                for (var x = 0; x < diff; x++) {
                        d += '0';
                } 
                var enforced = splitValue[0] + '.' + d;
                return enforced;

        },

});

L.Map.mergeOptions({
        positionControl: false
});

L.Map.addInitHook(function () {
        if (this.options.positionControl) {
                this.positionControl = new L.Control.MousePosition();
                this.addControl(this.positionControl);
        }
});

L.control.mouseposition = function (options) {
        return new L.Control.MousePosition(options);
};
