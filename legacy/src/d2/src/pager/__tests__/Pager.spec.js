import Pager from '../Pager';

describe('Pager', () => {
    let pagerFixtureOne;
    let pageFixtureTwo;

    it('should not be allowed to be called without new', () => {
        expect(() => Pager()).toThrowError('Cannot call a class as a function');
    });

    describe('instance without data', () => {
        let pager;

        beforeEach(() => {
            pager = new Pager();
        });

        it('should set the page to first', () => {
            expect(pager.page).toBe(1);
        });

        it('should set the total page count to 1', () => {
            expect(pager.pageCount).toBe(1);
        });

        it('should set the total item count to undefined', () => {
            expect(pager.total).toBeUndefined();
        });

        it('should not set the nextPage', () => {
            expect(pager.nextPage).toBeUndefined();
        });

        it('should not set the prevPage', () => {
            expect(pager.prevPage).toBeUndefined();
        });
    });

    describe('instance with data', () => {
        let pager;
        let modelDefinition;

        beforeEach(() => {
            pagerFixtureOne = {
                page: 1,
                pageCount: 37,
                total: 1844,
                nextPage: 'http://localhost:8080/dhis/api/dataElements?page=2',
            };
            pageFixtureTwo = {
                page: 3,
                pageCount: 37,
                total: 1844,
                nextPage: 'http://localhost:8080/dhis/api/dataElements?page=4',
                prevPage: 'http://localhost:8080/dhis/api/dataElements?page=2',
            };

            class ModelDefinition {}
            ModelDefinition.prototype.list = jest.fn().mockReturnValue(Promise.resolve());
            modelDefinition = new ModelDefinition();

            pager = new Pager(pagerFixtureOne, modelDefinition);
        });

        it('should be an instance of Pager', () => {
            expect(pager).toBeInstanceOf(Pager);
        });

        it('should have a total item count', () => {
            expect(pager.total).toBe(1844);
        });

        it('should have the current page number', () => {
            expect(pager.page).toBe(1);
        });

        it('should have a pageCount', () => {
            expect(pager.pageCount).toBe(37);
        });

        it('should have a nextPage url', () => {
            expect(pager.nextPage).toBe('http://localhost:8080/dhis/api/dataElements?page=2');
        });

        it('should have previous page', () => {
            pager = new Pager(pageFixtureTwo);

            expect(pager.prevPage).toBe('http://localhost:8080/dhis/api/dataElements?page=2');
        });

        describe('hasNextPage', () => {
            it('should be a function', () => {
                expect(pager.hasNextPage).toBeInstanceOf(Function);
            });

            it('should return true if there is a next page', () => {
                expect(pager.hasNextPage()).toBe(true);
            });

            it('should return false if there is no next page', () => {
                delete pager.nextPage;

                expect(pager.hasNextPage()).toBe(false);
            });
        });

        describe('hasPreviousPage', () => {
            it('should be a function', () => {
                expect(pager.hasPreviousPage).toBeInstanceOf(Function);
            });

            it('should return true if there is a previous page', () => {
                pager.prevPage = 'some link to a page';

                expect(pager.hasPreviousPage()).toBe(true);
            });

            it('should return false if there is no previous page', () => {
                expect(pager.hasPreviousPage()).toBe(false);
            });
        });

        describe('nextPage', () => {
            it('should be a method on the collection', () => {
                expect(pager.getNextPage).toBeInstanceOf(Function);
            });

            it('should return a promise', () => {
                expect(pager.getNextPage()).toBeInstanceOf(Promise);
            });

            it('should call the model definition for a new list', () => {
                pager.getNextPage();

                expect(modelDefinition.list).toBeCalled();
            });

            it('should only ask for a new list if the pager has a nextPage property', () => {
                delete pager.nextPage;

                return pager.getNextPage()
                    .catch(() => {
                        expect(modelDefinition.list).not.toHaveBeenCalled();
                    });
            });

            it('should return a rejected promise if there are no more new pages', () => {
                delete pager.nextPage;

                return pager.getNextPage()
                    .catch((message) => {
                        expect(message).toBe('There is no next page for this collection');
                    });
            });

            it('should call next page with the current page number + 1', () => {
                pager.getNextPage();

                expect(modelDefinition.list).toBeCalledWith({ page: 2 });
            });
        });

        describe('previousPage', () => {
            it('should be a method on the collection', () => {
                expect(pager.getPreviousPage).toBeInstanceOf(Function);
            });

            it('should return a promise', () => {
                expect(pager.getPreviousPage()).toBeInstanceOf(Promise);
            });

            it('should ask for the previous page if the prevPage property is set', () => {
                pager.page = 2;
                pager.prevPage = 'http://url.to.the.next.page';

                pager.getPreviousPage();

                expect(modelDefinition.list).toBeCalled();
            });

            it('should not ask for a new list if there is no previous page', () => {
                expect(modelDefinition.list).not.toHaveBeenCalled();
            });

            it('should return a rejected promise if there are no more previous pages', () => pager.getPreviousPage()
                .catch((message) => {
                    expect(message).toBe('There is no previous page for this collection');
                }));

            it('should call the list method with the current page number - 1', () => {
                pager.page = 3;
                pager.prevPage = 'http://url.to.the.next.page';

                pager.getPreviousPage();

                expect(modelDefinition.list).toBeCalledWith({ page: 2 });
            });
        });

        describe('goToPage', () => {
            it('should call the list method with the passed page number', () => {
                pager.goToPage(2);

                expect(modelDefinition.list).toBeCalledWith({ page: 2 });
            });

            it('should throw an error when the page is less than 1', () => {
                expect(() => pager.goToPage(0)).toThrowError('PageNr can not be less than 1');
                expect(() => pager.goToPage(-1)).toThrowError('PageNr can not be less than 1');
            });

            it('should throw an error when the page is larger than the pagecount', () => {
                expect(() => pager.goToPage(38))
                    .toThrowError('PageNr can not be larger than the total page count of 37');
                expect(() => pager.goToPage(100))
                    .toThrowError('PageNr can not be larger than the total page count of 37');
            });
        });

        describe('should throw error when there is no page handler', () => {
            it('should throw an error when no handler is specified', (done) => {
                pager = new Pager(pagerFixtureOne);

                pager.getNextPage()
                    .then(done)
                    .catch(() => {
                        done();
                    });
            });
        });
    });

    describe('instance with data and query parameters', () => {
        let pager;
        let modelDefinition;

        beforeEach(() => {
            pagerFixtureOne = {
                page: 1,
                pageCount: 37,
                query: { fields: ':all' },
                total: 1844,
                nextPage: 'http://localhost:8080/dhis/api/dataElements?page=2l',
            };
            pageFixtureTwo = {
                page: 3,
                pageCount: 37,
                total: 1844,
                nextPage: 'http://localhost:8080/dhis/api/dataElements?page=4',
                prevPage: 'http://localhost:8080/dhis/api/dataElements?page=2',
            };

            class ModelDefinition {}
            ModelDefinition.prototype.list = jest.fn().mockReturnValue(Promise.resolve());
            modelDefinition = new ModelDefinition();

            pager = new Pager(pagerFixtureOne, modelDefinition, { fields: ':all' });
        });

        describe('nextPage', () => {
            it('should include the current query parameters', () => {
                pager.getNextPage();

                expect(modelDefinition.list).toBeCalledWith({ page: 2, fields: ':all' });
            });
        });

        describe('previousPage', () => {
            it('should include the current query parameters', () => {
                pager.page = 3;
                pager.prevPage = 'http://url.to.the.next.page';

                pager.getPreviousPage();

                expect(modelDefinition.list).toBeCalledWith({ page: 2, fields: ':all' });
            });
        });

        describe('goToPage', () => {
            it('should call the list method with the current query parameters', () => {
                pager.goToPage(2);

                expect(modelDefinition.list).toBeCalledWith({ page: 2, fields: ':all' });
            });
        });
    });
});
