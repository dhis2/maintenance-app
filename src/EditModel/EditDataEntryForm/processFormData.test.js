import { generateHtmlForId, processFormData } from './processFormData';

describe('generateHtmlForId', () => {
    it('gets the label from operands if the ID contains a dash', () => {
        const html = generateHtmlForId('some-id', {
            operands: {
                'some-id': 'label'
            }
        });

        expect(html).toBe(`<input id="some-id" name="entryfield" title="label" value="[ label ]"/>`);
    });

    it('gets the label from totals if it contains the ID', () => {
        const html = generateHtmlForId('someId', {
            totals: {
                'someId': 'label'
            }
        });

        expect(html).toBe(`<input dataelementid="someId" id="totalsomeId" name="total" name="total" readonly title="label" value="[ label ]"/>`);
    });

    it('gets the label from indicators if it contains the ID', () => {
        const html = generateHtmlForId('someId', {
            totals: {},
            indicators: {
                'someId': 'label'
            }
        });

        expect(html).toBe(`<input indicatorid="someId" id="indicatorsomeId" name="indicator" readonly title="label" value="[ label ]"/>`);
    });
});
