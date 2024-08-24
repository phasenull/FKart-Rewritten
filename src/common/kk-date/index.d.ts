// kkdate.d.ts

declare const days: string[];
declare const format_types: {
    dddd: 'dddd';
    YYYY: 'YYYY';
    DD: 'DD';
    MM: 'MM';
    'YYYY-MM-DD': 'YYYY-MM-DD';
    'YYYY.MM.DD': 'YYYY.MM.DD';
    'DD.MM.YYYY': 'DD.MM.YYYY';
    'HH:mm:ss': 'HH:mm:ss';
    'HH:mm': 'HH:mm';
    HH: 'HH';
    mm: 'mm';
    ss: 'ss';
};
declare const format_types_regex: {
    YYYY: RegExp;
    MM: RegExp;
    DD: RegExp;
    'YYYY-MM-DD': RegExp;
    'YYYY.MM.DD': RegExp;
    'DD.MM.YYYY': RegExp;
    'HH:mm:ss': RegExp;
    'HH:mm': RegExp;
    HH: RegExp;
    mm: RegExp;
    ss: RegExp;
};

declare class KkDate {
    constructor(date?: string | Date | KkDate);

    date: Date | null;
    date_string: string | null;

    getTime(): number | Error;
    isBefore(date: string | Date | KkDate): boolean | Error;
    isSameOrBefore(date: string | Date | KkDate): boolean | Error;
    isAfter(date: string | Date | KkDate): boolean | Error;
    isSameOrAfter(date: string | Date | KkDate): boolean | Error;
    isSame(date: string | Date | KkDate): boolean | Error;
    isBetween(start: string | Date | KkDate, end: string | Date | KkDate): boolean | Error;
    toString(): string | Error;
    toDateString(): string | Error;
    toISOString(): string | Error;
    toJSON(): string | Error;
    toUTCString(): string | Error;
    toLocaleDateString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string | Error;
    toLocaleString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string | Error;
    toLocaleTimeString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string | Error;
    toTimeString(): string | Error;
    valueOf(): number | Error;
    add(amount: number, type: 'seconds' | 'minutes' | 'hours' | 'days' | 'months' | 'years'): KkDate | Error;
    diff(end: string | Date | KkDate, type: 'seconds' | 'minutes' | 'hours' | 'days' | 'months' | 'years', is_decimal?: boolean): number | Error;
    diff_range(end: string | Date | KkDate, type: 'seconds' | 'minutes' | 'hours' | 'days' | 'months' | 'years', template?: string): string[] | Error;
    format_c(separator?: string, ...template: string[]): string | Error;
    format(template: 'YYYY-MM-DD HH:mm:ss' | 'YYYY-MM-DDTHH:mm:ss' | 'YYYY-MM-DD HH:mm' | 'YYYY-MM-DD HH' | 'YYYY-MM-DD' | 'DD.MM.YYYY' | 'YYYY.MM.DD HH:mm' | 'YYYY.MM.DD HH' | 'YYYY.MM.DD HH:mm:ss' | 'DD.MM.YYYY HH:mm:ss' | 'DD.MM.YYYY HH:mm' | 'dddd' | 'HH:mm:ss' | 'HH:mm' | 'X' | 'x'): string | Error;
    isValid(): boolean;
    getDate(): Date | Error;
}

declare function isInvalid(date: Date | KkDate): boolean;
declare function isKkDate(value: any): boolean;
declare function format(date: KkDate | Date, template: string): string | Error;
declare function absFloor(number: number): number;
declare function diff(start: KkDate | Date, end: KkDate | Date, type: 'seconds' | 'minutes' | 'hours' | 'days' | 'months' | 'years', is_decimal?: boolean, turn_difftime?: boolean): { start: KkDate; type_value: number; endDate: Date; diffTime: number } | number;
declare function formatter(orj_this: Date, template: string): string;
declare function isValid(date_string: string, template: string): boolean;

export = KkDate;