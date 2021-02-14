// TODO: Localization

const rangeNames: {
    [key: string]: string
} = {
    'y': 'year',
    'mth': 'month',
    'd': 'day',
    'h': 'hour',
    'm': 'minute',
    's': 'seconds'
}

const dividers: {
    [key: string]: number
} = {
    'y': 31536000,
    'mth': 2592000,
    'd': 86400,
    'h': 3600,
    'm': 60,
    's': 1
}

type TimeAndRange = {
    time: number
    range: string
}

class PrettyTime {
    getSec(date: Date = null) {
        return Math.floor((date || new Date()).getTime() / 1000)
    }

    /**
     * diffSec
     * @param {Date} start Start time in ms
     * @param {Date} end End time in ms
     * @return {number} seconds
     */
    diffSec(start: Date, end: Date = null) {
        end = end || new Date()
        return Math.floor(Math.abs((end.getTime() - start.getTime()) / 1000))
    }

    diffTimeRange(start: Date, end: Date = null): TimeAndRange {
        const diff = this.diffSec(start, end)
        let range: string = null
        let time: number = diff
        for (const [r, div] of Object.entries(dividers)) {
            time = diff / div
            if (time > 1) {
                time = Math.floor(time)
                range = r
                break
            }
        }

        return {
            range,
            time,
        }
    }

    prettyDiff(start: Date, end: Date = null): string {
        const {range, time} = this.diffTimeRange(start, end)
        const rangeString = time > 1 ? `${rangeNames[range]}s` : rangeNames[range]

        return `${time} ${rangeString} ago`
    }
}

export default new PrettyTime()
