import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import {ImageMarginButton} from '../buttons/ImageMarginButton';
import {AssetsManager} from '../managers/AssetsManager';
import {FontStyle} from '../utils/FontStyle';
import {ArrayEx, parse_point} from '../utils/Utils';

import {Place} from './Place';
import {Links} from './Links';
import {Item} from './Item';

export class Game extends PIXI.Container {
	private data: Object;
	private items: Array<Item>;
	private btn_check: ImageMarginButton;
	private links: Links;
	private places: Array<Place>;
	private selected_item!: Item | null;
	private selected_place!: Place | null;

	constructor() {

		super();

		let data: Object = AssetsManager.instance.getObject('data');
		this.addChild(AssetsManager.instance.getSprite(data['background']));

		let title: PIXI.Text = new PIXI.Text(data['title'], new FontStyle('Bold', 48).fill(0x225694).wordWrap().style);
		this.addChild(title).position.set(84, 64);

		let subtitle: PIXI.Text = new PIXI.Text(data['subtitle'], new FontStyle('Regular', 32).fill(0x303030).wordWrap().style);
		this.addChild(subtitle).position.set(84, 167);


		this.links = new Links();
		this.addChild(this.links);

		this.data = AssetsManager.instance.getObject('data');
		let places: Array<Object> = this.data['places'];

		this.places = new Array<Place>();

		for (let i: number = 0; i < places.length; i++) {

			let place: Place = new Place(places[i]);
			place.addListener('select', this.onPlaceSelect);
			this.places.push(place);
			this.addChild(place);
		}

		this.links.init(this.places);

		let items: ArrayEx<string> = new ArrayEx(this.data['items']);
		items.randomize();

		this.items = new Array<Item>();

		for (let i: number = 0; i < items.length; i++) {
			let item: Item = new Item(items[i], new PIXI.Point(1034, 300 + 147 * i));
			item.addListener('select', this.onItemSelect);
			this.items.push(item);
			this.addChild(item);
		}


		this.btn_check = new ImageMarginButton('btn_check_answer');
		this.addChild(this.btn_check).position.set(860, 942);
		this.btn_check.addListener('press', this.onCheckClick);
		this.btn_check.visible = false;

	}

	private onPlaceSelect = (place: Place) => {
		if (this.selected_item == null) {
			this.selected_place = place;

			for (let i: number = 0; i < this.places.length; i++) {
				if (this.places[i] == place) continue;
				if (this.places[i].state == 'free') this.places[i].reset();
			}
		}

		if (this.selected_item != null) {
			this.selected_item.link(place);
			place.link(this.selected_item);
			this.selected_item = null;
		}

		this.update_links();

		this.check_filled();
	}

	private onItemSelect = (item: Item) => {
		if (this.selected_place == null) {
			this.selected_item = item;

			for (let i: number = 0; i < this.items.length; i++) {
				if (this.items[i] == item) continue;
				if (this.items[i].state == 'free') this.items[i].reset();
			}
		}

		if (this.selected_place != null) {
			this.selected_place.link(item);
			item.link(this.selected_place);
			this.selected_place = null;
		}

		this.update_links();

		this.check_filled();
	}

	private check_filled = () => {
		this.btn_check.visible = false;

		for (let i: number = 0; i < this.places.length; i++) {
			if (this.places[i].filled == false) return;
		}

		this.btn_check.visible = true;
	}

	public show = () => {
		this.visible = true;
		gsap.to(this, {duration: 0.5, alpha: 1});
	}

	public hide = () => {
		gsap.to(this, {duration: 0.5, alpha: 0, onComplete: this.onHideComplete});
	}

	private onHideComplete = () => {
		this.visible = false;
	}

	public retry = () => {
		for (let i: number = 0; i < this.places.length; i++) {
			let place: Place = this.places[i];
			place.reset();
		}
		this.update_links();
	}

	private onCheckClick = () => {
		this.btn_check.visible = false;

		let res: boolean = this.links.check();

		if (res == false) setTimeout(this.retry, 2000);
		else this.emit('complete');
	}

	private update_links = () => {
		this.links.update();
	}
}