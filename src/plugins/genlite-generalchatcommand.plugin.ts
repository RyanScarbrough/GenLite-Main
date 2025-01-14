/*
    Copyright (C) 2022-2023 dpeGit
*/
/*
    This file is part of GenLite.

    GenLite is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

    GenLite is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along with Foobar. If not, see <https://www.gnu.org/licenses/>.
*/

import { GenLitePlugin } from '../core/interfaces/plugin.interface';

export class GenLiteGeneralChatCommands implements GenLitePlugin {
    static pluginName = 'GenLiteGeneralChatCommands';

    loginTime: number = 0;
    playedTime: number = 0; // this is a running counter not a date
    timeSinceLastSave: number = 0;

    playedSaveInverval: NodeJS.Timer;
    isLogged = false;

    async init() {
        document.genlite.registerPlugin(this);

        let playedString = localStorage.getItem("genlitePlayed")
        if (playedString == null) {
            this.playedTime = 0;
        } else {
            this.playedTime = parseInt(playedString);
        }
        document.genlite.commands.register("played", () => { this.printPlayedTime.apply(this) }, "Prints time played.");
        document.genlite.commands.register("logged", () => { this.printLoggedTime.apply(this) }, "Prints time logged in.");
    }

    loginOK() {
        if (this.isLogged)
            return;
        console.log("login");
        this.loginTime = Date.now();
        this.timeSinceLastSave = this.loginTime;
        this.playedSaveInverval = setInterval(() => this.savePlayed.apply(this), 1000); // set an interval to save the playedTime every second in case of ungraceful close
        this.isLogged = true;
    }

    logoutOK() {
        console.log("logout");
        this.loginTime = 0;
        clearInterval(this.playedSaveInverval);
        this.playedSaveInverval = null;
        this.savePlayed();
        this.isLogged = false;
    }

    /* genlite command callbacks */
    printLoggedTime() {
        document.genlite.commands.print(this.msToHumanTime(Date.now() - this.loginTime));
    }

    printPlayedTime() {
        document.genlite.commands.print(this.msToHumanTime(this.playedTime));
    }

    savePlayed() {
        let curTime = Date.now();
        if (this.timeSinceLastSave == 0) { //if for whatever reason this wasnt set (currently caused by a genfanad bug not genlite set it now and just ignore this update)
            this.timeSinceLastSave = Date.now();
            return;
        }
        this.playedTime += curTime - this.timeSinceLastSave;
        this.timeSinceLastSave = curTime;
        localStorage.setItem("genlitePlayed", this.playedTime.toString());
    }

    msToHumanTime(ms) {
        let h = Math.floor(ms / 3600000);
        let m = Math.floor(ms / 60000) % 60;
        let s = Math.floor(ms / 1000) % 60;

        let hS = h.toString();
        let mS = m < 10 ? "0" + m.toString() : m.toString();
        let sS = s < 10 ? "0" + s.toString() : s.toString();


        return `${hS}:${mS}:${sS}`
    }
}
