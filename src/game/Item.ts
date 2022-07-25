import * as PIXI from 'pixi.js';
import {AssetsManager} from '../managers/AssetsManager';
import {FontStyle} from '../utils/FontStyle';
import {Place} from './Place';
import {RoundButton} from './RoundButton';

export class Item extends PIXI.Sprite {
    public data: Object;

    private text: PIXI.Text;
    private button: RoundButton;

    public linked: boolean = false;
    public selected: boolean = false;
    public place!: Place | null;

    constructor(data: Object, pos: PIXI.Point) {
        super();
        this.data = data;
        this.position.copyFrom(pos);

        let icon: PIXI.Sprite = AssetsManager.instance.getSprite('icon1');
        this.addChild(icon).position.set(70, 20);
        icon.anchor.set(0, 0.5);


        let title: string = data['text'];

        this.text = new PIXI.Text(title, new FontStyle('Regular', 32).fill(0x303030).wordWrap().style);
        this.addChild(this.text);
        this.text.position.set(100, 20);
        this.text.anchor.set(0, 0.5);

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

    public link = (place: Place) => {
        this.selected = false;
        this.linked = true;
        this.place = place;
        this.update_button();
    }

    public unlink = (reset: boolean = true) => {
        this.linked = false;
        if (this.place != null) {
            let tmp: Place = this.place;
            this.place = null;
            tmp.unlink();
        }
        if (reset) this.button.reset();
        this.button.enabled = true;
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
        this.selected = false;
        this.button.reset();
        this.enable();
    }

    public enable = () => {
        this.button.enabled = true;
    }

    public disable = () => {
        this.button.enabled = false;
    }

    public get correct(): boolean {
        return false;
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