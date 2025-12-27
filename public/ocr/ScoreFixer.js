export default class ScoreFixer {
	constructor() {
		this.last_good_digits = null;
	}

	charToDigit(char) {
		return parseInt(char, 16);
	}

	digitToChar(digit) {
		return digit.toString(16).toUpperCase();
	}

	reset() {
		this.last_good_digits = null;
	}

	fix(_digits) {
		if (_digits === null) {
			// don't store nulls (assume pause)
			// last_good_digits will still be used on resume
			// reset() must be called to clean last_good_digits
			return null;
		}

		const digits = _digits.concat();

		if (this.last_good_digits == null) {
			this.last_good_digits = digits;
			return digits;
		}

		// Score pattern is '-ADDDDD' or '-DDDDDDD'
		// Position 0: minus sign (0 = no minus, 17 = minus)
		// Position 1: first score digit (what we need to fix)
		const minusSignChanged = digits[0] !== this.last_good_digits[0];
		const first_digit_diff = digits[1] - this.last_good_digits[1];

		// first score digit can be same or increased by 1!
		if (!minusSignChanged && first_digit_diff >= -1 && first_digit_diff <= 1) {
			this.last_good_digits = digits;
			return digits;
		}

		// If only minus sign changed but score digits are the same, accept it
		if (minusSignChanged && first_digit_diff === 0) {
			this.last_good_digits = digits;
			return digits;
		}

		// K, if this point is reached, something is not right, and we need to apply correction

		if (digits[1] == 0xa) {
			// A, should it have been a 4?
			if (
				this.last_good_digits[1] === 0x3 ||
				this.last_good_digits[1] === 0x4
			) {
				digits[1] = 0x4;
			}
		} else if (digits[1] === 0x4) {
			// 4, should it have been a A?
			if (
				this.last_good_digits[1] === 0x9 ||
				this.last_good_digits[1] === 0xa
			) {
				digits[1] = 0xa;
			}
		} else if (digits[1] === 0x8) {
			// 8, should it have been a B?
			if (
				this.last_good_digits[1] === 0xa ||
				this.last_good_digits[1] === 0xb
			) {
				digits[1] = 0xb;
			}
			// should it have been a D? WTF ...  -_- https://discord.com/channels/817528744565932043/817528917590016020/1241837618489196605
			else if (
				this.last_good_digits[1] === 0xc ||
				this.last_good_digits[1] === 0xd
			) {
				digits[1] = 0xd;
			}
		} else if (digits[1] === 0xb) {
			// B, should it have been a 8?
			if (
				this.last_good_digits[1] === 0x7 ||
				this.last_good_digits[1] === 0x8
			) {
				digits[1] = 0x8;
			}
			// should it have been a D? WTF ...  -_- https://discord.com/channels/817528744565932043/817528917590016020/1241885852121038908
			else if (
				this.last_good_digits[1] === 0xc ||
				this.last_good_digits[1] === 0xd
			) {
				digits[1] = 0xd;
			}
		} else if (digits[1] === 0x0) {
			// 0, should it have been a D?
			if (
				this.last_good_digits[1] === 0xc ||
				this.last_good_digits[1] === 0xd
			) {
				digits[1] = 0xd;
			}
		} else if (digits[1] === 0xd) {
			// D, should it have been a 0?
			if (
				this.last_good_digits[1] === 0x0 ||
				this.last_good_digits[1] === 0xf
			) {
				digits[1] = 0x0;
			}
		} else if (digits[1] === 0xe) {
			// E, should it have been a 6?
			if (
				this.last_good_digits[1] === 0x5 ||
				this.last_good_digits[1] === 0x6
			) {
				digits[1] = 0x6;
			}
		} else if (digits[1] === 0x6) {
			// 6, should it have been a E?
			if (
				this.last_good_digits[1] === 0xd ||
				this.last_good_digits[1] === 0xe
			) {
				digits[1] = 0xe;
			}
		}

		this.last_good_digits = digits;

		return digits;
	}
}
