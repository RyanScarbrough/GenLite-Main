/*
    Copyright (C) 2023 snwhd
*/
/*
    This file is part of GenLite.

    GenLite is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

    GenLite is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along with Foobar. If not, see <https://www.gnu.org/licenses/>.
*/

import { GenLitePlugin } from '../core/interfaces/plugin.interface';

export class GenLiteInventoryPlugin implements GenLitePlugin {
    static pluginName = 'GenLiteInventoryPlugin';

    disableDragOnShift: boolean = false;

    async init() {
        document.genlite.registerPlugin(this);
        this.disableDragOnShift = document.genlite.settings.add(
            "Inventory.ShiftDisableDrag",
            true,
            "Disable Dragging w/ Shift",
            "checkbox",
            this.handleDisableDrag,
            this
        );
    }

    public loginOK() {
        this.updateState();
    }

    handleDisableDrag(state: boolean) {
        this.disableDragOnShift = state;
        this.updateState();
    }

    updateState() {
        if (this.disableDragOnShift) {
            for (const i in document.game.INVENTORY.DOM_slots) {
                let slot = document.game.INVENTORY.DOM_slots[i];
                slot.item_div.onmousedown = function (e) {
                    if (e.shiftKey) {
                        e.preventDefault();
                    }
                }
            }
        } else {
            for (const i in document.game.INVENTORY.DOM_slots) {
                let slot = document.game.INVENTORY.DOM_slots[i];
                slot.item_div.onmousedown = function (e) { };
            }
        }
    }

}
