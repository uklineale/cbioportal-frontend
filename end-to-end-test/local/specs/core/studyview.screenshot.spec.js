const assert = require('assert');
const assertScreenShotMatch = require('../../../shared/lib/testUtils')
    .assertScreenShotMatch;
const {
    checkElementWithMouseDisabled,
    goToUrlAndSetLocalStorage,
    waitForNetworkQuiet,
} = require('../../../shared/specUtils');

const CBIOPORTAL_URL = process.env.CBIOPORTAL_URL.replace(/\/$/, '');
const ADD_CHART_BUTTON = "[data-test='add-charts-button']";
const ADD_CHART_GENERIC_ASSAY_TAB =
    '.addChartTabs a.tabAnchor_MUTATIONAL_SIGNATURE_TEST';
const GENERIC_ASSAY_PROFILE_SELECTION =
    "[data-test='GenericAssayProfileSelection']";
const CATEGORY_MUTATIONAL_SIGNATURE_PROFILE_TEXT =
    'div=mutational signature category v2 (61 samples)';
const WAIT_FOR_VISIBLE_TIMEOUT = 30000;

describe('study view generic assay categorical/binary features', function() {
    it('generic assay pie chart should be added in the summary tab', () => {
        const url = `${CBIOPORTAL_URL}/study?id=lgg_ucsf_2014_test_generic_assay`;
        goToUrlAndSetLocalStorage(url, true);
        waitForNetworkQuiet();

        $(ADD_CHART_BUTTON).waitForDisplayed({
            timeout: WAIT_FOR_VISIBLE_TIMEOUT,
        });
        $(ADD_CHART_BUTTON).click();

        waitForNetworkQuiet();

        // Change to GENERIC ASSAY tab
        $(ADD_CHART_GENERIC_ASSAY_TAB).waitForDisplayed({
            timeout: WAIT_FOR_VISIBLE_TIMEOUT,
        });
        $(ADD_CHART_GENERIC_ASSAY_TAB).click();

        // Select category mutational signature profile
        $(GENERIC_ASSAY_PROFILE_SELECTION).waitForDisplayed({
            timeout: WAIT_FOR_VISIBLE_TIMEOUT,
        });
        $(GENERIC_ASSAY_PROFILE_SELECTION).click();

        $(GENERIC_ASSAY_PROFILE_SELECTION)
            .$(CATEGORY_MUTATIONAL_SIGNATURE_PROFILE_TEXT)
            .waitForDisplayed({
                timeout: WAIT_FOR_VISIBLE_TIMEOUT,
            });
        $(GENERIC_ASSAY_PROFILE_SELECTION)
            .$(CATEGORY_MUTATIONAL_SIGNATURE_PROFILE_TEXT)
            .click();

        // wait for generic assay data loading complete
        // and select a option
        $('div[data-test="GenericAssaySelection"]').waitForExist();
        $('div[data-test="GenericAssaySelection"] input').setValue(
            'mutational_signature_category_10'
        );
        $('div=Select all filtered options (1)').waitForExist();
        $('div=Select all filtered options (1)').click();
        // close the dropdown
        var indicators = $$('div[class$="indicatorContainer"]');
        indicators[0].click();
        var selectedOptions = $$('div[class$="multiValue"]');
        assert.equal(selectedOptions.length, 1);

        $('button=Add Chart').click();
        // Wait for chart to be added
        waitForNetworkQuiet();

        const res = checkElementWithMouseDisabled('#mainColumn');
        assertScreenShotMatch(res);
    });
});