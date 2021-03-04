// TODO: Localization

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]

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
    getSec(date?: Date) {
        return Math.floor((date || new Date()).getTime() / 1000)
    }

    /**
     * diffSec
     * @param {Date} start Start time in ms
     * @param {Date} end End time in ms
     * @return {number} seconds
     */
    diffSec(start: Date, end?: Date) {
        if (!start) {
            throw new Error(`Start date must be specified`)
        }

        end = end || new Date()
        return Math.floor(Math.abs((end.getTime() - start.getTime()) / 1000))
    }

    diffTimeRange(start: Date, end?: Date): TimeAndRange {
        const diff = this.diffSec(start, end)
        let range: string = 's'
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

    prettyDiff(start: Date, end?: Date): string {
        const {range, time} = this.diffTimeRange(start, end)
        const rangeString = time > 1 ? `${rangeNames[range]}s` : rangeNames[range]

        return `${time} ${rangeString} ago`
    }

    prettyDate(date: Date): string {
        const y = date.getFullYear()
        const m = date.getMonth()
        const d = date.getDay()

        const month = months[m]
        return `${d} ${month}, ${y}`
    }
}

export default new PrettyTime()
