import * as PIXI from 'pixi.js';
import {DashedLine} from '../utils/Utils';
import {Item} from './Item';
import {Place} from './Place';

export class Links extends PIXI.Container {
    private places!: Array<Place>;

    constructor() {
        super();
    }

    public init = (places: Array<Place>) => {
        this.places = places;
    }

    public update = () => {
        this.removeChildren();

        for (let i: number = 0; i < this.places.length; i++) {
            let place: Place = this.places[i];
            let item: Item | null = place.item;

            if (item == null) continue;
            let line: DashedLine = new DashedLine([place.point, item.point], place.fixed ? 0x4aba91 : 0x2484ce, 2, [5, 5]);
            this.addChild(line);
        }
    }

    public check = (): boolean => {
        this.removeChildren();

        let res: boolean = true;

        for (let i: number = 0; i < this.places.length; i++) {
            let place: Place = this.places[i];
            let item: Item | null = place.item;

            if (item == null) continue;

            let line: DashedLine = new DashedLine([place.point, item.point], place.correct ? 0x4aba91 : 0xba4a4a, 2, [5, 5]);
            this.addChild(line);

            if (place.correct == false) res = false;
        }

        return res;
    }

    public clear = () => {
        this.removeChildren();
    }
}
