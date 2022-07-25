import * as PIXI from 'pixi.js';
import {AssetsManager} from '../managers/AssetsManager';

export class RoundButton extends PIXI.Sprite {
    private button_normal: PIXI.Sprite;
    private button_over: PIXI.Sprite;
    private button_selected: PIXI.Sprite;
    private button_right: PIXI.Sprite;
    private button_wrong: PIXI.Sprite;
    private type: string = 'normal';
    private over: boolean = false;;

    constructor() {
        super();

        this.button_normal = AssetsManager.instance.getSprite('button_normal');
        this.addChild(this.button_normal).position.set(0, 0);

        this.button_over = AssetsManager.instance.getSprite('button_over');
        this.addChild(this.button_over).position.set(0, 0);

        this.button_selected = AssetsManager.instance.getSprite('button_selected');
        this.addChild(this.button_selected);
        this.button_right = AssetsManager.instance.getSprite('button_right');
        this.addChild(this.button_right);
        this.button_wrong = AssetsManager.instance.getSprite('button_wrong');
        this.addChild(this.button_wrong);

        this.update();
        this.enabled = true;

        this.addListener('pointerdown', this.onMouseEvent);
        this.addListener('pointerover', this.onMouseEvent);
        this.addListener('pointerout', this.onMouseEvent);
    }

    private onMouseEvent = (event: PIXI.InteractionEvent) => {

        switch (event.type) {

            case 'pointerdown':
                this.type = 'selected';
                this.update();
                this.emit('select');
                break;

            case 'pointerover':
                this.over = true;
                this.update();
                break;

            case 'pointerout':
                this.over = false;
                this.update();
                break;
        }
    }

    private update = () => {

        this.button_normal.visible = false;
        this.button_over.visible = false;
        this.button_selected.visible = false;
        this.button_right.visible = false;
        this.button_wrong.visible = false;

        if (this.type == 'normal' && this.over == false) this.button_normal.visible = true;
        if (this.type == 'normal' && this.over == true) this.button_over.visible = true;
        else if (this.type == 'selected') this.button_selected.visible = true;
        else if (this.type == 'right') this.button_right.visible = true;
        else if (this.type == 'wrong') this.button_wrong.visible = true;
    }

    public set enabled(value: boolean) {

        this.interactive = value;
        this.buttonMode = value;
    }

    public right = () => {

        this.type = 'right';
        this.update();
    }

    public wrong = () => {

        this.type = 'wrong';
        this.update();
    }

    public reset = () => {

        this.type = 'normal';
        this.update();
    }

    public select = () => {

        this.type = 'selected';
        this.update();
    }

    public fix = () => {

        this.enabled = false;
    }
}