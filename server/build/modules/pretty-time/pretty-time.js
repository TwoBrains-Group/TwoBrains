"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rangeNames = {
    'y': 'year',
    'mth': 'month',
    'd': 'day',
    'h': 'hour',
    'm': 'minute',
    's': 'seconds'
};
const dividers = {
    'y': 31536000,
    'mth': 2592000,
    'd': 86400,
    'h': 3600,
    'm': 60,
    's': 1
};
class PrettyTime {
    getSec(date) {
        return Math.floor((date || new Date()).getTime() / 1000);
    }
    diffSec(start, end) {
        if (!start) {
            throw new Error(`Start date must be specified`);
        }
        end = end || new Date();
        return Math.floor(Math.abs((end.getTime() - start.getTime()) / 1000));
    }
    diffTimeRange(start, end) {
        const diff = this.diffSec(start, end);
        let range = 's';
        let time = diff;
        for (const [r, div] of Object.entries(dividers)) {
            time = diff / div;
            if (time > 1) {
                time = Math.floor(time);
                range = r;
                break;
            }
        }
        return {
            range,
            time,
        };
    }
    prettyDiff(start, end) {
        const { range, time } = this.diffTimeRange(start, end);
        const rangeString = time > 1 ? `${rangeNames[range]}s` : rangeNames[range];
        return `${time} ${rangeString} ago`;
    }
}
exports.default = new PrettyTime();
//# sourceMappingURL=pretty-time.js.map