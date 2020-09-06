/*
	Copyright (c) DeltaNedas 2020

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.	See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.	If not, see <https://www.gnu.org/licenses/>.
*/

const ui = require("ui-lib/library");

var button, container;
var item = Items.thorium

const set = () => {
	container.visible = !container.visible;
	if (container.visible) {
		Sounds.click.play();

		container.clear();
		ItemSelection.buildTable(container, Vars.content.items(), () => item, i => {
			item = i;
			container.visible = false;
			button.style.imageUp.region = i.icon(Cicon.full);
		});
		container.pack();
		container.setPosition(button.x + button.width / 2 - container.width / 2,
			button.y - container.height);

		// Scale it like block config
		container.transform = true;
		container.actions(Actions.scaleTo(0, 1), Actions.visible(true),
		Actions.scaleTo(1, 1, 0.07, Interp.pow3Out));
	}
};

const grab = () => {
	container.visible = false;

	const core = Vars.state.teams.cores(Vars.player.team()).first();
	Call.requestItem(Vars.player, core, item, 15);
};

ui.addButton("item-grabber", item, null, cell => {
	container = new Table();
	Vars.ui.hudGroup.addChild(container);

	button = cell.get();
	if (Vars.mobile) {
		button.addListener(extend(ClickListener, {
			clicked(event, x, y) {
				const delay = Time.millis() - this.visualPressedTime;
				// Long press to set, quarter of a second
				if (delay < 150) {
					grab();
				} else {
					set();
				}
			}
		}));
	} else {
		button.clicked(grab);
		button.clicked(Input.KeyCode.mouseRight, set);
	}
});
