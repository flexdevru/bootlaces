import * as PIXI from 'pixi.js';
import {parse_point} from '../utils/Utils';
import {Item} from './Item';
import {RoundButton} from './RoundButton';

export class Place extends PIXI.Sprite {

    public data: Object;

    private button: RoundButton;

    public linked: boolean = false;
    public selected: boolean = false;
    public item!: Item | null;
    public fixed: boolean = false;


    constructor(data: Object) {

        super();
        this.data = data;

        this.position.copyFrom(parse_point(this.data['position']));

        this.button = new RoundButton();
        this.addChild(this.button);
        this.button.addListener('select', this.onButtonClick);
    }

    private onButtonClick = () => {

        if (this.linked == true) this.unlink(false);
        this.emit('select', this);
        this.selected = true;
        this.button.select();
    }

    public link = (item: Item) => {

        this.selected = false;
        this.linked = true;
        this.item = item;
        this.update_button();
    }

    public unlink = (reset: boolean = true) => {

        this.linked = false;
        if (this.item != null) {
            let tmp: Item = this.item;
            this.item = null;
            tmp.unlink();
        }
        if (reset) this.button.reset();
    }

    public right = () => {

        this.button.right();
        this.button.enabled = false;
    }

    public wrong = () => {

        this.button.wrong();
        this.button.enabled = false;
    }

    public reset = () => {
        if (this.item != null && this.item.type == this.type) {

            this.fixed = true;
            return;
        }

        this.selected = false;
        this.unlink();
        this.enable();
    }

    public enable = () => {

        this.button.enabled = true;
    }

    public disable = () => {

        this.button.enabled = false;
    }

    public get correct(): boolean {

        let res: boolean = false;
        if (this.item != null && this.item.type == this.type) res = true;

        if (res == true) {
            this.right();
            if (this.item != null) this.item.right();
        }
        else {
            this.wrong();
            if (this.item != null) this.item.wrong()
        }

        return res;
    }

    public get filled(): boolean {

        if (this.item == null) return false;
        return true;
    }

    public get type(): number {

        return this.data['type'];
    }

    public get state(): string {

        if (this.linked == false) return 'free';
        return 'linked';
    }

    public get point(): PIXI.Point {

        return new PIXI.Point(this.position.x + 40 / 2, this.position.y + 40 / 2);
    }

    private update_button = () => {

        if (this.state == 'linked') this.button.select();
    }
}