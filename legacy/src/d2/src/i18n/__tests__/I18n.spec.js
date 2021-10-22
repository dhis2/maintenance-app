import MockApi from '../../api/Api';
import I18n from '../../i18n/I18n';

jest.mock('../../api/Api');

describe('Internationalisation (I18n)', () => {
    let mockApi;
    let i18n;

    const mockTranslations = {
        general_settings: 'General settings',
        yes: 'Yup',
        no: 'Nope',
        system_settings_in_french: 'Paramètres du système',
        // 'escapes': 'Characters may be escaped! Even\nnewlines?!?',
        string_with_variable: 'Some times $$variable$$ are useful',
    };

    const mockUnicode = 'Param\\u00e8tres du syst\\u00e8me';
    const mockEscape = 'Characters\\ may \\b\\e \\e\\s\\c\\a\\p\\e\\d\\!\\\\ Even\\\nnewline\\s\\?\\!\\?';
    const mockPropsFile = `${'general_settings=General settings\n' +
        'yes=Yup\n' +
        'no=Nope\n\n# Blank lines and commends - ignored?\n#\n\n' +
        'system_settings_in_french='}${mockUnicode}\n` +
        `escapes=${mockEscape}\n`;

    beforeEach(() => {
        mockApi = MockApi.getApi();
        i18n = new I18n();
    });

    afterEach(() => {
        MockApi.mockReset();
    });

    it('should not be allowed to be called without new', () => {
        expect(() => I18n()).toThrowError('Cannot call a class as a function'); // eslint-disable-line
    });

    it('should set an instance of Api onto the SystemConfiguration instance', () => {
        expect(i18n.api).toBe(mockApi);
    });

    it('addSource() should be a function', () => {
        expect(i18n.addSource).toBeInstanceOf(Function);
    });

    it('addStrings() should be a function', () => {
        expect(i18n.addStrings).toBeInstanceOf(Function);
    });

    it('load() should be a function', () => {
        expect(i18n.load).toBeInstanceOf(Function);
    });

    it('should set the passed sources onto the object', () => {
        const sources = ['translation_18n'];

        i18n = new I18n(sources);

        expect(i18n.sources).toBe(sources);
    });

    it('should use the passed Api object', () => {
        mockApi = jest.fn();

        i18n = new I18n([], mockApi);

        expect(i18n.api).toBe(mockApi);
    });

    it('getTranslations() should throw an error is translations haven\'t been loaded yet', (done) => {
        try {
            i18n.getTranslation('some_string');
            done('No error thrown!');
        } catch (e) {
            done();
        }
    });

    describe('getI18n', () => {
        it('should be a function on the I18n class', () => {
            expect(typeof I18n.getI18n).toBe('function');
        });

        it('should return a new instanceof I18n', () => {
            expect(I18n.getI18n()).toBeInstanceOf(I18n);
        });
    });

    describe('addStrings()', () => {
        it('accepts a single string', () => {
            i18n.addStrings('yes');
            const strings = Array.from(i18n.strings);
            expect(strings).toContain('yes');
            expect(strings.length).toBe(1);
        });

        it('accepts an array of strings', () => {
            i18n.addStrings(['yes', 'no', 'maybe']);
            const strings = Array.from(i18n.strings);
            expect(strings).toContain('yes');
            expect(strings).toContain('no');
            expect(strings).toContain('maybe');
            expect(strings.length).toBe(3);
        });

        it('handles consequtive calls', () => {
            i18n.addStrings(['yes', 'no']);
            i18n.addStrings('maybe');
            i18n.addStrings('probably');
            const strings = Array.from(i18n.strings);
            expect(strings).toContain('yes');
            expect(strings).toContain('no');
            expect(strings).toContain('maybe');
            expect(strings).toContain('probably');
            expect(strings.length).toBe(4);
        });

        it('doesn\'t add duplicates', () => {
            i18n.addStrings(['yes', 'no']);
            i18n.addStrings(['no', 'maybe']);
            i18n.addStrings(['maybe', 'probably', 'yes']);
            const strings = Array.from(i18n.strings);
            expect(strings).toContain('yes');
            expect(strings).toContain('no');
            expect(strings).toContain('maybe');
            expect(strings).toContain('probably');
            expect(strings.length).toBe(4);
        });

        it('should not add empty strings', () => {
            jest.spyOn(i18n.strings, 'add');

            i18n.addStrings(['yes', '', '  ']);

            expect(i18n.strings.add).toHaveBeenCalledTimes(1);
        });
    });

    describe('load()', () => {
        let apiGet;
        let apiPost;
        let apiReq;

        beforeEach(() => {
            apiGet = mockApi.get.mockReturnValueOnce(Promise.resolve(mockTranslations));

            apiPost = mockApi.post.mockReturnValueOnce(Promise.resolve(mockTranslations));

            apiReq = mockApi.request.mockReturnValueOnce(Promise.resolve(mockPropsFile));

            i18n.addStrings(['yes', 'no']);
        });

        it('should return a promise', (done) => {
            i18n.load().then(() => {
                done();
            }, (err) => {
                done(err);
            });
        });

        it('should POST to get untranslated strings', (done) => {
            i18n.load().then(() => {
                try {
                    expect(apiGet).toHaveBeenCalledTimes(0);
                    expect(apiPost).toHaveBeenCalledTimes(1);
                    expect(apiReq).toHaveBeenCalledTimes(0);
                    expect(i18n.getTranslation('yes')).toEqual(mockTranslations.yes);
                    done();
                } catch (e) {
                    done(e);
                }
            }, (err) => {
                done(err);
            });
        });

        it('should load props files first', () => {
            i18n.addSource('props_file_name');

            return i18n.load().then(() => {
                expect(apiGet).toHaveBeenCalledTimes(0);
                expect(apiPost).toHaveBeenCalledTimes(0);
                expect(apiReq).toHaveBeenCalledTimes(1);
            });
        });

        it('keeps going if one props file fails', (done) => {
            i18n.addSource('props_file_one');
            i18n.addSource('props_file_two');
            i18n.addSource('props_file_three');

            apiReq.mockReset();
            apiReq
                .mockReturnValueOnce(Promise.resolve(mockPropsFile))
                .mockReturnValueOnce(Promise.reject('404 Fail or something'))
                .mockReturnValueOnce(Promise.resolve(''));

            i18n.load().then(() => {
                try {
                    expect(apiGet).toHaveBeenCalledTimes(0);
                    expect(apiPost).toHaveBeenCalledTimes(0);
                    expect(apiReq).toHaveBeenCalledTimes(3);
                    done();
                } catch (e) {
                    done(e);
                }
            }, (err) => {
                done(err);
            });
        });

        it('chooses strings based on source order', () => {
            i18n.addSource('slow_props_file');
            i18n.addSource('fast_props_file');

            apiReq.mockReset();
            apiReq
                .mockReturnValueOnce(new Promise((resolve) => {
                    setTimeout(() => {
                        resolve('result=first priority file\n');
                    });
                }))
                .mockReturnValueOnce(Promise.resolve('result=first file to load\n'));

            return i18n.load().then(() => {
                expect(i18n.getTranslation('result')).toEqual('first priority file');
            });
        });

        it('should not add the strings if no responses were returned', () => {
            i18n.addStrings(['string_that_has_no_translation']);
            mockApi.post.mockReturnValueOnce(Promise.resolve({
                string_that_has_no_translation: 'string_that_has_no_translation',
            }));

            return i18n.load()
                .then(() => expect(i18n.translations.string_that_has_no_translation).toBeUndefined());
        });
    });

    describe('async API', () => {
        beforeEach(() => {
            i18n.api.get
                .mockReturnValue(Promise.resolve(mockTranslations));

            i18n.api.request
                .mockReturnValue(Promise.resolve(mockPropsFile));

            i18n.api.post
                .mockReturnValue(Promise.resolve(mockTranslations));

            i18n.addSource('mockPropsFile');
            i18n.addStrings(Object.keys(mockTranslations));
        });

        describe('getTranslation()', () => {
            it('returns the correct translations', (done) => {
                i18n.load().then(() => {
                    try {
                        Object.keys(mockTranslations).forEach((key) => {
                            expect(i18n.getTranslation(key)).toEqual(mockTranslations[key]);
                        });
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
            });

            it('decodes unicode entities from properties files', () => i18n.load().then(() => {
                expect(mockApi.get).toHaveBeenCalledTimes(0);
                expect(mockApi.post).toHaveBeenCalledTimes(1);
                expect(mockApi.request).toHaveBeenCalledTimes(1);
                expect(i18n.getTranslation('system_settings_in_french'))
                    .toEqual(mockTranslations.system_settings_in_french);
                expect(i18n.getTranslation('system_settings_in_french')).not.toEqual(mockUnicode);
            }));

            it('returns ** string ** for unknown strings', (done) => {
                i18n.load().then(() => {
                    try {
                        expect(i18n.getTranslation('string')).toEqual('** string **');
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
            });

            it('replaces $$variable$$ in translations', (done) => {
                i18n.load().then(() => {
                    const sub1 = i18n.getTranslation('string_with_variable', { variable: 'tests' });
                    const sub2 = i18n.getTranslation('string_with_variable', { variable: 'FUNNY TRANSLATIONS' });

                    expect(sub1).toBe('Some times tests are useful');
                    expect(sub2).toBe('Some times FUNNY TRANSLATIONS are useful');
                    done();
                }).catch(done);
            });
        });

        describe('isTranslated()', () => {
            it('returns true for translated strings', (done) => {
                i18n.load().then(() => {
                    try {
                        Object.keys(mockTranslations).forEach((key) => {
                            expect(i18n.isTranslated(key)).toEqual(true);
                        });
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
            });

            it('returns false for untranslated strings', (done) => {
                i18n.load().then(() => {
                    try {
                        expect(i18n.isTranslated('string')).toEqual(false);
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
            });

            it('totally tilts out if translations haven\'t been loaded yet', (done) => {
                try {
                    expect(i18n.isTranslated('some random string')).toThrowError(Error);
                    done(new Error('No error thrown'));
                } catch (e) {
                    done();
                }
            });
        });

        describe('getUntranslatedStrings()', () => {
            it('returns undefined if translations haven\'t been loaded yet', () => {
                expect(i18n.getUntranslatedStrings()).toEqual(undefined);
            });

            it('returns an array', (done) => {
                i18n.load().then(() => {
                    try {
                        expect(i18n.getUntranslatedStrings()).toBeInstanceOf(Array);
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
            });

            it('doesn\'t return translated strings', () => {
                i18n.addStrings('string');

                return i18n.load().then(() => {
                    const str = i18n.getUntranslatedStrings();
                    expect(str).toContain('string');
                    expect(str).not.toContain('yes');
                    expect(str).not.toContain('some_random_string');
                });
            });
        });
    });
});
