package io.github.erp.web.rest;

/*-
 * Copyright © 2021 Edwin Njeru (mailnjeru@gmail.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import io.github.erp.ErpServiceApp;
import io.github.erp.config.SecurityBeanOverrideConfiguration;
import io.github.erp.domain.TaxRule;
import io.github.erp.domain.Payment;
import io.github.erp.repository.TaxRuleRepository;
import io.github.erp.repository.search.TaxRuleSearchRepository;
import io.github.erp.service.TaxRuleService;
import io.github.erp.service.dto.TaxRuleDTO;
import io.github.erp.service.mapper.TaxRuleMapper;
import io.github.erp.service.dto.TaxRuleCriteria;
import io.github.erp.service.TaxRuleQueryService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link TaxRuleResource} REST controller.
 */
@SpringBootTest(classes = { SecurityBeanOverrideConfiguration.class, ErpServiceApp.class })
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class TaxRuleResourceIT {

    private static final String DEFAULT_PAYMENT_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_PAYMENT_NUMBER = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_PAYMENT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_PAYMENT_DATE = LocalDate.now(ZoneId.systemDefault());
    private static final LocalDate SMALLER_PAYMENT_DATE = LocalDate.ofEpochDay(-1L);

    private static final Double DEFAULT_TELCO_EXCISE_DUTY = 1D;
    private static final Double UPDATED_TELCO_EXCISE_DUTY = 2D;
    private static final Double SMALLER_TELCO_EXCISE_DUTY = 1D - 1D;

    private static final Double DEFAULT_VALUE_ADDED_TAX = 1D;
    private static final Double UPDATED_VALUE_ADDED_TAX = 2D;
    private static final Double SMALLER_VALUE_ADDED_TAX = 1D - 1D;

    private static final Double DEFAULT_WITHHOLDING_VAT = 1D;
    private static final Double UPDATED_WITHHOLDING_VAT = 2D;
    private static final Double SMALLER_WITHHOLDING_VAT = 1D - 1D;

    private static final Double DEFAULT_WITHHOLDING_TAX_CONSULTANCY = 1D;
    private static final Double UPDATED_WITHHOLDING_TAX_CONSULTANCY = 2D;
    private static final Double SMALLER_WITHHOLDING_TAX_CONSULTANCY = 1D - 1D;

    private static final Double DEFAULT_WITHHOLDING_TAX_RENT = 1D;
    private static final Double UPDATED_WITHHOLDING_TAX_RENT = 2D;
    private static final Double SMALLER_WITHHOLDING_TAX_RENT = 1D - 1D;

    private static final Double DEFAULT_CATERING_LEVY = 1D;
    private static final Double UPDATED_CATERING_LEVY = 2D;
    private static final Double SMALLER_CATERING_LEVY = 1D - 1D;

    private static final Double DEFAULT_SERVICE_CHARGE = 1D;
    private static final Double UPDATED_SERVICE_CHARGE = 2D;
    private static final Double SMALLER_SERVICE_CHARGE = 1D - 1D;

    private static final Double DEFAULT_WITHHOLDING_TAX_IMPORTED_SERVICE = 1D;
    private static final Double UPDATED_WITHHOLDING_TAX_IMPORTED_SERVICE = 2D;
    private static final Double SMALLER_WITHHOLDING_TAX_IMPORTED_SERVICE = 1D - 1D;

    @Autowired
    private TaxRuleRepository taxRuleRepository;

    @Autowired
    private TaxRuleMapper taxRuleMapper;

    @Autowired
    private TaxRuleService taxRuleService;

    /**
     * This repository is mocked in the io.github.erp.repository.search test package.
     *
     * @see io.github.erp.repository.search.TaxRuleSearchRepositoryMockConfiguration
     */
    @Autowired
    private TaxRuleSearchRepository mockTaxRuleSearchRepository;

    @Autowired
    private TaxRuleQueryService taxRuleQueryService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTaxRuleMockMvc;

    private TaxRule taxRule;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TaxRule createEntity(EntityManager em) {
        TaxRule taxRule = new TaxRule()
            .paymentNumber(DEFAULT_PAYMENT_NUMBER)
            .paymentDate(DEFAULT_PAYMENT_DATE)
            .telcoExciseDuty(DEFAULT_TELCO_EXCISE_DUTY)
            .valueAddedTax(DEFAULT_VALUE_ADDED_TAX)
            .withholdingVAT(DEFAULT_WITHHOLDING_VAT)
            .withholdingTaxConsultancy(DEFAULT_WITHHOLDING_TAX_CONSULTANCY)
            .withholdingTaxRent(DEFAULT_WITHHOLDING_TAX_RENT)
            .cateringLevy(DEFAULT_CATERING_LEVY)
            .serviceCharge(DEFAULT_SERVICE_CHARGE)
            .withholdingTaxImportedService(DEFAULT_WITHHOLDING_TAX_IMPORTED_SERVICE);
        return taxRule;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TaxRule createUpdatedEntity(EntityManager em) {
        TaxRule taxRule = new TaxRule()
            .paymentNumber(UPDATED_PAYMENT_NUMBER)
            .paymentDate(UPDATED_PAYMENT_DATE)
            .telcoExciseDuty(UPDATED_TELCO_EXCISE_DUTY)
            .valueAddedTax(UPDATED_VALUE_ADDED_TAX)
            .withholdingVAT(UPDATED_WITHHOLDING_VAT)
            .withholdingTaxConsultancy(UPDATED_WITHHOLDING_TAX_CONSULTANCY)
            .withholdingTaxRent(UPDATED_WITHHOLDING_TAX_RENT)
            .cateringLevy(UPDATED_CATERING_LEVY)
            .serviceCharge(UPDATED_SERVICE_CHARGE)
            .withholdingTaxImportedService(UPDATED_WITHHOLDING_TAX_IMPORTED_SERVICE);
        return taxRule;
    }

    @BeforeEach
    public void initTest() {
        taxRule = createEntity(em);
    }

    @Test
    @Transactional
    public void createTaxRule() throws Exception {
        int databaseSizeBeforeCreate = taxRuleRepository.findAll().size();
        // Create the TaxRule
        TaxRuleDTO taxRuleDTO = taxRuleMapper.toDto(taxRule);
        restTaxRuleMockMvc.perform(post("/api/tax-rules").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(taxRuleDTO)))
            .andExpect(status().isCreated());

        // Validate the TaxRule in the database
        List<TaxRule> taxRuleList = taxRuleRepository.findAll();
        assertThat(taxRuleList).hasSize(databaseSizeBeforeCreate + 1);
        TaxRule testTaxRule = taxRuleList.get(taxRuleList.size() - 1);
        assertThat(testTaxRule.getPaymentNumber()).isEqualTo(DEFAULT_PAYMENT_NUMBER);
        assertThat(testTaxRule.getPaymentDate()).isEqualTo(DEFAULT_PAYMENT_DATE);
        assertThat(testTaxRule.getTelcoExciseDuty()).isEqualTo(DEFAULT_TELCO_EXCISE_DUTY);
        assertThat(testTaxRule.getValueAddedTax()).isEqualTo(DEFAULT_VALUE_ADDED_TAX);
        assertThat(testTaxRule.getWithholdingVAT()).isEqualTo(DEFAULT_WITHHOLDING_VAT);
        assertThat(testTaxRule.getWithholdingTaxConsultancy()).isEqualTo(DEFAULT_WITHHOLDING_TAX_CONSULTANCY);
        assertThat(testTaxRule.getWithholdingTaxRent()).isEqualTo(DEFAULT_WITHHOLDING_TAX_RENT);
        assertThat(testTaxRule.getCateringLevy()).isEqualTo(DEFAULT_CATERING_LEVY);
        assertThat(testTaxRule.getServiceCharge()).isEqualTo(DEFAULT_SERVICE_CHARGE);
        assertThat(testTaxRule.getWithholdingTaxImportedService()).isEqualTo(DEFAULT_WITHHOLDING_TAX_IMPORTED_SERVICE);

        // Validate the TaxRule in Elasticsearch
        verify(mockTaxRuleSearchRepository, times(1)).save(testTaxRule);
    }

    @Test
    @Transactional
    public void createTaxRuleWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = taxRuleRepository.findAll().size();

        // Create the TaxRule with an existing ID
        taxRule.setId(1L);
        TaxRuleDTO taxRuleDTO = taxRuleMapper.toDto(taxRule);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTaxRuleMockMvc.perform(post("/api/tax-rules").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(taxRuleDTO)))
            .andExpect(status().isBadRequest());

        // Validate the TaxRule in the database
        List<TaxRule> taxRuleList = taxRuleRepository.findAll();
        assertThat(taxRuleList).hasSize(databaseSizeBeforeCreate);

        // Validate the TaxRule in Elasticsearch
        verify(mockTaxRuleSearchRepository, times(0)).save(taxRule);
    }


    @Test
    @Transactional
    public void checkPaymentNumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = taxRuleRepository.findAll().size();
        // set the field null
        taxRule.setPaymentNumber(null);

        // Create the TaxRule, which fails.
        TaxRuleDTO taxRuleDTO = taxRuleMapper.toDto(taxRule);


        restTaxRuleMockMvc.perform(post("/api/tax-rules").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(taxRuleDTO)))
            .andExpect(status().isBadRequest());

        List<TaxRule> taxRuleList = taxRuleRepository.findAll();
        assertThat(taxRuleList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkPaymentDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = taxRuleRepository.findAll().size();
        // set the field null
        taxRule.setPaymentDate(null);

        // Create the TaxRule, which fails.
        TaxRuleDTO taxRuleDTO = taxRuleMapper.toDto(taxRule);


        restTaxRuleMockMvc.perform(post("/api/tax-rules").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(taxRuleDTO)))
            .andExpect(status().isBadRequest());

        List<TaxRule> taxRuleList = taxRuleRepository.findAll();
        assertThat(taxRuleList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllTaxRules() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList
        restTaxRuleMockMvc.perform(get("/api/tax-rules?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(taxRule.getId().intValue())))
            .andExpect(jsonPath("$.[*].paymentNumber").value(hasItem(DEFAULT_PAYMENT_NUMBER)))
            .andExpect(jsonPath("$.[*].paymentDate").value(hasItem(DEFAULT_PAYMENT_DATE.toString())))
            .andExpect(jsonPath("$.[*].telcoExciseDuty").value(hasItem(DEFAULT_TELCO_EXCISE_DUTY.doubleValue())))
            .andExpect(jsonPath("$.[*].valueAddedTax").value(hasItem(DEFAULT_VALUE_ADDED_TAX.doubleValue())))
            .andExpect(jsonPath("$.[*].withholdingVAT").value(hasItem(DEFAULT_WITHHOLDING_VAT.doubleValue())))
            .andExpect(jsonPath("$.[*].withholdingTaxConsultancy").value(hasItem(DEFAULT_WITHHOLDING_TAX_CONSULTANCY.doubleValue())))
            .andExpect(jsonPath("$.[*].withholdingTaxRent").value(hasItem(DEFAULT_WITHHOLDING_TAX_RENT.doubleValue())))
            .andExpect(jsonPath("$.[*].cateringLevy").value(hasItem(DEFAULT_CATERING_LEVY.doubleValue())))
            .andExpect(jsonPath("$.[*].serviceCharge").value(hasItem(DEFAULT_SERVICE_CHARGE.doubleValue())))
            .andExpect(jsonPath("$.[*].withholdingTaxImportedService").value(hasItem(DEFAULT_WITHHOLDING_TAX_IMPORTED_SERVICE.doubleValue())));
    }
    
    @Test
    @Transactional
    public void getTaxRule() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get the taxRule
        restTaxRuleMockMvc.perform(get("/api/tax-rules/{id}", taxRule.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(taxRule.getId().intValue()))
            .andExpect(jsonPath("$.paymentNumber").value(DEFAULT_PAYMENT_NUMBER))
            .andExpect(jsonPath("$.paymentDate").value(DEFAULT_PAYMENT_DATE.toString()))
            .andExpect(jsonPath("$.telcoExciseDuty").value(DEFAULT_TELCO_EXCISE_DUTY.doubleValue()))
            .andExpect(jsonPath("$.valueAddedTax").value(DEFAULT_VALUE_ADDED_TAX.doubleValue()))
            .andExpect(jsonPath("$.withholdingVAT").value(DEFAULT_WITHHOLDING_VAT.doubleValue()))
            .andExpect(jsonPath("$.withholdingTaxConsultancy").value(DEFAULT_WITHHOLDING_TAX_CONSULTANCY.doubleValue()))
            .andExpect(jsonPath("$.withholdingTaxRent").value(DEFAULT_WITHHOLDING_TAX_RENT.doubleValue()))
            .andExpect(jsonPath("$.cateringLevy").value(DEFAULT_CATERING_LEVY.doubleValue()))
            .andExpect(jsonPath("$.serviceCharge").value(DEFAULT_SERVICE_CHARGE.doubleValue()))
            .andExpect(jsonPath("$.withholdingTaxImportedService").value(DEFAULT_WITHHOLDING_TAX_IMPORTED_SERVICE.doubleValue()));
    }


    @Test
    @Transactional
    public void getTaxRulesByIdFiltering() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        Long id = taxRule.getId();

        defaultTaxRuleShouldBeFound("id.equals=" + id);
        defaultTaxRuleShouldNotBeFound("id.notEquals=" + id);

        defaultTaxRuleShouldBeFound("id.greaterThanOrEqual=" + id);
        defaultTaxRuleShouldNotBeFound("id.greaterThan=" + id);

        defaultTaxRuleShouldBeFound("id.lessThanOrEqual=" + id);
        defaultTaxRuleShouldNotBeFound("id.lessThan=" + id);
    }


    @Test
    @Transactional
    public void getAllTaxRulesByPaymentNumberIsEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where paymentNumber equals to DEFAULT_PAYMENT_NUMBER
        defaultTaxRuleShouldBeFound("paymentNumber.equals=" + DEFAULT_PAYMENT_NUMBER);

        // Get all the taxRuleList where paymentNumber equals to UPDATED_PAYMENT_NUMBER
        defaultTaxRuleShouldNotBeFound("paymentNumber.equals=" + UPDATED_PAYMENT_NUMBER);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByPaymentNumberIsNotEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where paymentNumber not equals to DEFAULT_PAYMENT_NUMBER
        defaultTaxRuleShouldNotBeFound("paymentNumber.notEquals=" + DEFAULT_PAYMENT_NUMBER);

        // Get all the taxRuleList where paymentNumber not equals to UPDATED_PAYMENT_NUMBER
        defaultTaxRuleShouldBeFound("paymentNumber.notEquals=" + UPDATED_PAYMENT_NUMBER);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByPaymentNumberIsInShouldWork() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where paymentNumber in DEFAULT_PAYMENT_NUMBER or UPDATED_PAYMENT_NUMBER
        defaultTaxRuleShouldBeFound("paymentNumber.in=" + DEFAULT_PAYMENT_NUMBER + "," + UPDATED_PAYMENT_NUMBER);

        // Get all the taxRuleList where paymentNumber equals to UPDATED_PAYMENT_NUMBER
        defaultTaxRuleShouldNotBeFound("paymentNumber.in=" + UPDATED_PAYMENT_NUMBER);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByPaymentNumberIsNullOrNotNull() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where paymentNumber is not null
        defaultTaxRuleShouldBeFound("paymentNumber.specified=true");

        // Get all the taxRuleList where paymentNumber is null
        defaultTaxRuleShouldNotBeFound("paymentNumber.specified=false");
    }
                @Test
    @Transactional
    public void getAllTaxRulesByPaymentNumberContainsSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where paymentNumber contains DEFAULT_PAYMENT_NUMBER
        defaultTaxRuleShouldBeFound("paymentNumber.contains=" + DEFAULT_PAYMENT_NUMBER);

        // Get all the taxRuleList where paymentNumber contains UPDATED_PAYMENT_NUMBER
        defaultTaxRuleShouldNotBeFound("paymentNumber.contains=" + UPDATED_PAYMENT_NUMBER);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByPaymentNumberNotContainsSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where paymentNumber does not contain DEFAULT_PAYMENT_NUMBER
        defaultTaxRuleShouldNotBeFound("paymentNumber.doesNotContain=" + DEFAULT_PAYMENT_NUMBER);

        // Get all the taxRuleList where paymentNumber does not contain UPDATED_PAYMENT_NUMBER
        defaultTaxRuleShouldBeFound("paymentNumber.doesNotContain=" + UPDATED_PAYMENT_NUMBER);
    }


    @Test
    @Transactional
    public void getAllTaxRulesByPaymentDateIsEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where paymentDate equals to DEFAULT_PAYMENT_DATE
        defaultTaxRuleShouldBeFound("paymentDate.equals=" + DEFAULT_PAYMENT_DATE);

        // Get all the taxRuleList where paymentDate equals to UPDATED_PAYMENT_DATE
        defaultTaxRuleShouldNotBeFound("paymentDate.equals=" + UPDATED_PAYMENT_DATE);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByPaymentDateIsNotEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where paymentDate not equals to DEFAULT_PAYMENT_DATE
        defaultTaxRuleShouldNotBeFound("paymentDate.notEquals=" + DEFAULT_PAYMENT_DATE);

        // Get all the taxRuleList where paymentDate not equals to UPDATED_PAYMENT_DATE
        defaultTaxRuleShouldBeFound("paymentDate.notEquals=" + UPDATED_PAYMENT_DATE);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByPaymentDateIsInShouldWork() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where paymentDate in DEFAULT_PAYMENT_DATE or UPDATED_PAYMENT_DATE
        defaultTaxRuleShouldBeFound("paymentDate.in=" + DEFAULT_PAYMENT_DATE + "," + UPDATED_PAYMENT_DATE);

        // Get all the taxRuleList where paymentDate equals to UPDATED_PAYMENT_DATE
        defaultTaxRuleShouldNotBeFound("paymentDate.in=" + UPDATED_PAYMENT_DATE);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByPaymentDateIsNullOrNotNull() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where paymentDate is not null
        defaultTaxRuleShouldBeFound("paymentDate.specified=true");

        // Get all the taxRuleList where paymentDate is null
        defaultTaxRuleShouldNotBeFound("paymentDate.specified=false");
    }

    @Test
    @Transactional
    public void getAllTaxRulesByPaymentDateIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where paymentDate is greater than or equal to DEFAULT_PAYMENT_DATE
        defaultTaxRuleShouldBeFound("paymentDate.greaterThanOrEqual=" + DEFAULT_PAYMENT_DATE);

        // Get all the taxRuleList where paymentDate is greater than or equal to UPDATED_PAYMENT_DATE
        defaultTaxRuleShouldNotBeFound("paymentDate.greaterThanOrEqual=" + UPDATED_PAYMENT_DATE);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByPaymentDateIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where paymentDate is less than or equal to DEFAULT_PAYMENT_DATE
        defaultTaxRuleShouldBeFound("paymentDate.lessThanOrEqual=" + DEFAULT_PAYMENT_DATE);

        // Get all the taxRuleList where paymentDate is less than or equal to SMALLER_PAYMENT_DATE
        defaultTaxRuleShouldNotBeFound("paymentDate.lessThanOrEqual=" + SMALLER_PAYMENT_DATE);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByPaymentDateIsLessThanSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where paymentDate is less than DEFAULT_PAYMENT_DATE
        defaultTaxRuleShouldNotBeFound("paymentDate.lessThan=" + DEFAULT_PAYMENT_DATE);

        // Get all the taxRuleList where paymentDate is less than UPDATED_PAYMENT_DATE
        defaultTaxRuleShouldBeFound("paymentDate.lessThan=" + UPDATED_PAYMENT_DATE);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByPaymentDateIsGreaterThanSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where paymentDate is greater than DEFAULT_PAYMENT_DATE
        defaultTaxRuleShouldNotBeFound("paymentDate.greaterThan=" + DEFAULT_PAYMENT_DATE);

        // Get all the taxRuleList where paymentDate is greater than SMALLER_PAYMENT_DATE
        defaultTaxRuleShouldBeFound("paymentDate.greaterThan=" + SMALLER_PAYMENT_DATE);
    }


    @Test
    @Transactional
    public void getAllTaxRulesByTelcoExciseDutyIsEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where telcoExciseDuty equals to DEFAULT_TELCO_EXCISE_DUTY
        defaultTaxRuleShouldBeFound("telcoExciseDuty.equals=" + DEFAULT_TELCO_EXCISE_DUTY);

        // Get all the taxRuleList where telcoExciseDuty equals to UPDATED_TELCO_EXCISE_DUTY
        defaultTaxRuleShouldNotBeFound("telcoExciseDuty.equals=" + UPDATED_TELCO_EXCISE_DUTY);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByTelcoExciseDutyIsNotEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where telcoExciseDuty not equals to DEFAULT_TELCO_EXCISE_DUTY
        defaultTaxRuleShouldNotBeFound("telcoExciseDuty.notEquals=" + DEFAULT_TELCO_EXCISE_DUTY);

        // Get all the taxRuleList where telcoExciseDuty not equals to UPDATED_TELCO_EXCISE_DUTY
        defaultTaxRuleShouldBeFound("telcoExciseDuty.notEquals=" + UPDATED_TELCO_EXCISE_DUTY);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByTelcoExciseDutyIsInShouldWork() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where telcoExciseDuty in DEFAULT_TELCO_EXCISE_DUTY or UPDATED_TELCO_EXCISE_DUTY
        defaultTaxRuleShouldBeFound("telcoExciseDuty.in=" + DEFAULT_TELCO_EXCISE_DUTY + "," + UPDATED_TELCO_EXCISE_DUTY);

        // Get all the taxRuleList where telcoExciseDuty equals to UPDATED_TELCO_EXCISE_DUTY
        defaultTaxRuleShouldNotBeFound("telcoExciseDuty.in=" + UPDATED_TELCO_EXCISE_DUTY);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByTelcoExciseDutyIsNullOrNotNull() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where telcoExciseDuty is not null
        defaultTaxRuleShouldBeFound("telcoExciseDuty.specified=true");

        // Get all the taxRuleList where telcoExciseDuty is null
        defaultTaxRuleShouldNotBeFound("telcoExciseDuty.specified=false");
    }

    @Test
    @Transactional
    public void getAllTaxRulesByTelcoExciseDutyIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where telcoExciseDuty is greater than or equal to DEFAULT_TELCO_EXCISE_DUTY
        defaultTaxRuleShouldBeFound("telcoExciseDuty.greaterThanOrEqual=" + DEFAULT_TELCO_EXCISE_DUTY);

        // Get all the taxRuleList where telcoExciseDuty is greater than or equal to UPDATED_TELCO_EXCISE_DUTY
        defaultTaxRuleShouldNotBeFound("telcoExciseDuty.greaterThanOrEqual=" + UPDATED_TELCO_EXCISE_DUTY);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByTelcoExciseDutyIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where telcoExciseDuty is less than or equal to DEFAULT_TELCO_EXCISE_DUTY
        defaultTaxRuleShouldBeFound("telcoExciseDuty.lessThanOrEqual=" + DEFAULT_TELCO_EXCISE_DUTY);

        // Get all the taxRuleList where telcoExciseDuty is less than or equal to SMALLER_TELCO_EXCISE_DUTY
        defaultTaxRuleShouldNotBeFound("telcoExciseDuty.lessThanOrEqual=" + SMALLER_TELCO_EXCISE_DUTY);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByTelcoExciseDutyIsLessThanSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where telcoExciseDuty is less than DEFAULT_TELCO_EXCISE_DUTY
        defaultTaxRuleShouldNotBeFound("telcoExciseDuty.lessThan=" + DEFAULT_TELCO_EXCISE_DUTY);

        // Get all the taxRuleList where telcoExciseDuty is less than UPDATED_TELCO_EXCISE_DUTY
        defaultTaxRuleShouldBeFound("telcoExciseDuty.lessThan=" + UPDATED_TELCO_EXCISE_DUTY);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByTelcoExciseDutyIsGreaterThanSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where telcoExciseDuty is greater than DEFAULT_TELCO_EXCISE_DUTY
        defaultTaxRuleShouldNotBeFound("telcoExciseDuty.greaterThan=" + DEFAULT_TELCO_EXCISE_DUTY);

        // Get all the taxRuleList where telcoExciseDuty is greater than SMALLER_TELCO_EXCISE_DUTY
        defaultTaxRuleShouldBeFound("telcoExciseDuty.greaterThan=" + SMALLER_TELCO_EXCISE_DUTY);
    }


    @Test
    @Transactional
    public void getAllTaxRulesByValueAddedTaxIsEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where valueAddedTax equals to DEFAULT_VALUE_ADDED_TAX
        defaultTaxRuleShouldBeFound("valueAddedTax.equals=" + DEFAULT_VALUE_ADDED_TAX);

        // Get all the taxRuleList where valueAddedTax equals to UPDATED_VALUE_ADDED_TAX
        defaultTaxRuleShouldNotBeFound("valueAddedTax.equals=" + UPDATED_VALUE_ADDED_TAX);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByValueAddedTaxIsNotEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where valueAddedTax not equals to DEFAULT_VALUE_ADDED_TAX
        defaultTaxRuleShouldNotBeFound("valueAddedTax.notEquals=" + DEFAULT_VALUE_ADDED_TAX);

        // Get all the taxRuleList where valueAddedTax not equals to UPDATED_VALUE_ADDED_TAX
        defaultTaxRuleShouldBeFound("valueAddedTax.notEquals=" + UPDATED_VALUE_ADDED_TAX);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByValueAddedTaxIsInShouldWork() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where valueAddedTax in DEFAULT_VALUE_ADDED_TAX or UPDATED_VALUE_ADDED_TAX
        defaultTaxRuleShouldBeFound("valueAddedTax.in=" + DEFAULT_VALUE_ADDED_TAX + "," + UPDATED_VALUE_ADDED_TAX);

        // Get all the taxRuleList where valueAddedTax equals to UPDATED_VALUE_ADDED_TAX
        defaultTaxRuleShouldNotBeFound("valueAddedTax.in=" + UPDATED_VALUE_ADDED_TAX);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByValueAddedTaxIsNullOrNotNull() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where valueAddedTax is not null
        defaultTaxRuleShouldBeFound("valueAddedTax.specified=true");

        // Get all the taxRuleList where valueAddedTax is null
        defaultTaxRuleShouldNotBeFound("valueAddedTax.specified=false");
    }

    @Test
    @Transactional
    public void getAllTaxRulesByValueAddedTaxIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where valueAddedTax is greater than or equal to DEFAULT_VALUE_ADDED_TAX
        defaultTaxRuleShouldBeFound("valueAddedTax.greaterThanOrEqual=" + DEFAULT_VALUE_ADDED_TAX);

        // Get all the taxRuleList where valueAddedTax is greater than or equal to UPDATED_VALUE_ADDED_TAX
        defaultTaxRuleShouldNotBeFound("valueAddedTax.greaterThanOrEqual=" + UPDATED_VALUE_ADDED_TAX);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByValueAddedTaxIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where valueAddedTax is less than or equal to DEFAULT_VALUE_ADDED_TAX
        defaultTaxRuleShouldBeFound("valueAddedTax.lessThanOrEqual=" + DEFAULT_VALUE_ADDED_TAX);

        // Get all the taxRuleList where valueAddedTax is less than or equal to SMALLER_VALUE_ADDED_TAX
        defaultTaxRuleShouldNotBeFound("valueAddedTax.lessThanOrEqual=" + SMALLER_VALUE_ADDED_TAX);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByValueAddedTaxIsLessThanSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where valueAddedTax is less than DEFAULT_VALUE_ADDED_TAX
        defaultTaxRuleShouldNotBeFound("valueAddedTax.lessThan=" + DEFAULT_VALUE_ADDED_TAX);

        // Get all the taxRuleList where valueAddedTax is less than UPDATED_VALUE_ADDED_TAX
        defaultTaxRuleShouldBeFound("valueAddedTax.lessThan=" + UPDATED_VALUE_ADDED_TAX);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByValueAddedTaxIsGreaterThanSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where valueAddedTax is greater than DEFAULT_VALUE_ADDED_TAX
        defaultTaxRuleShouldNotBeFound("valueAddedTax.greaterThan=" + DEFAULT_VALUE_ADDED_TAX);

        // Get all the taxRuleList where valueAddedTax is greater than SMALLER_VALUE_ADDED_TAX
        defaultTaxRuleShouldBeFound("valueAddedTax.greaterThan=" + SMALLER_VALUE_ADDED_TAX);
    }


    @Test
    @Transactional
    public void getAllTaxRulesByWithholdingVATIsEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where withholdingVAT equals to DEFAULT_WITHHOLDING_VAT
        defaultTaxRuleShouldBeFound("withholdingVAT.equals=" + DEFAULT_WITHHOLDING_VAT);

        // Get all the taxRuleList where withholdingVAT equals to UPDATED_WITHHOLDING_VAT
        defaultTaxRuleShouldNotBeFound("withholdingVAT.equals=" + UPDATED_WITHHOLDING_VAT);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByWithholdingVATIsNotEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where withholdingVAT not equals to DEFAULT_WITHHOLDING_VAT
        defaultTaxRuleShouldNotBeFound("withholdingVAT.notEquals=" + DEFAULT_WITHHOLDING_VAT);

        // Get all the taxRuleList where withholdingVAT not equals to UPDATED_WITHHOLDING_VAT
        defaultTaxRuleShouldBeFound("withholdingVAT.notEquals=" + UPDATED_WITHHOLDING_VAT);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByWithholdingVATIsInShouldWork() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where withholdingVAT in DEFAULT_WITHHOLDING_VAT or UPDATED_WITHHOLDING_VAT
        defaultTaxRuleShouldBeFound("withholdingVAT.in=" + DEFAULT_WITHHOLDING_VAT + "," + UPDATED_WITHHOLDING_VAT);

        // Get all the taxRuleList where withholdingVAT equals to UPDATED_WITHHOLDING_VAT
        defaultTaxRuleShouldNotBeFound("withholdingVAT.in=" + UPDATED_WITHHOLDING_VAT);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByWithholdingVATIsNullOrNotNull() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where withholdingVAT is not null
        defaultTaxRuleShouldBeFound("withholdingVAT.specified=true");

        // Get all the taxRuleList where withholdingVAT is null
        defaultTaxRuleShouldNotBeFound("withholdingVAT.specified=false");
    }

    @Test
    @Transactional
    public void getAllTaxRulesByWithholdingVATIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where withholdingVAT is greater than or equal to DEFAULT_WITHHOLDING_VAT
        defaultTaxRuleShouldBeFound("withholdingVAT.greaterThanOrEqual=" + DEFAULT_WITHHOLDING_VAT);

        // Get all the taxRuleList where withholdingVAT is greater than or equal to UPDATED_WITHHOLDING_VAT
        defaultTaxRuleShouldNotBeFound("withholdingVAT.greaterThanOrEqual=" + UPDATED_WITHHOLDING_VAT);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByWithholdingVATIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where withholdingVAT is less than or equal to DEFAULT_WITHHOLDING_VAT
        defaultTaxRuleShouldBeFound("withholdingVAT.lessThanOrEqual=" + DEFAULT_WITHHOLDING_VAT);

        // Get all the taxRuleList where withholdingVAT is less than or equal to SMALLER_WITHHOLDING_VAT
        defaultTaxRuleShouldNotBeFound("withholdingVAT.lessThanOrEqual=" + SMALLER_WITHHOLDING_VAT);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByWithholdingVATIsLessThanSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where withholdingVAT is less than DEFAULT_WITHHOLDING_VAT
        defaultTaxRuleShouldNotBeFound("withholdingVAT.lessThan=" + DEFAULT_WITHHOLDING_VAT);

        // Get all the taxRuleList where withholdingVAT is less than UPDATED_WITHHOLDING_VAT
        defaultTaxRuleShouldBeFound("withholdingVAT.lessThan=" + UPDATED_WITHHOLDING_VAT);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByWithholdingVATIsGreaterThanSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where withholdingVAT is greater than DEFAULT_WITHHOLDING_VAT
        defaultTaxRuleShouldNotBeFound("withholdingVAT.greaterThan=" + DEFAULT_WITHHOLDING_VAT);

        // Get all the taxRuleList where withholdingVAT is greater than SMALLER_WITHHOLDING_VAT
        defaultTaxRuleShouldBeFound("withholdingVAT.greaterThan=" + SMALLER_WITHHOLDING_VAT);
    }


    @Test
    @Transactional
    public void getAllTaxRulesByWithholdingTaxConsultancyIsEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where withholdingTaxConsultancy equals to DEFAULT_WITHHOLDING_TAX_CONSULTANCY
        defaultTaxRuleShouldBeFound("withholdingTaxConsultancy.equals=" + DEFAULT_WITHHOLDING_TAX_CONSULTANCY);

        // Get all the taxRuleList where withholdingTaxConsultancy equals to UPDATED_WITHHOLDING_TAX_CONSULTANCY
        defaultTaxRuleShouldNotBeFound("withholdingTaxConsultancy.equals=" + UPDATED_WITHHOLDING_TAX_CONSULTANCY);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByWithholdingTaxConsultancyIsNotEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where withholdingTaxConsultancy not equals to DEFAULT_WITHHOLDING_TAX_CONSULTANCY
        defaultTaxRuleShouldNotBeFound("withholdingTaxConsultancy.notEquals=" + DEFAULT_WITHHOLDING_TAX_CONSULTANCY);

        // Get all the taxRuleList where withholdingTaxConsultancy not equals to UPDATED_WITHHOLDING_TAX_CONSULTANCY
        defaultTaxRuleShouldBeFound("withholdingTaxConsultancy.notEquals=" + UPDATED_WITHHOLDING_TAX_CONSULTANCY);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByWithholdingTaxConsultancyIsInShouldWork() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where withholdingTaxConsultancy in DEFAULT_WITHHOLDING_TAX_CONSULTANCY or UPDATED_WITHHOLDING_TAX_CONSULTANCY
        defaultTaxRuleShouldBeFound("withholdingTaxConsultancy.in=" + DEFAULT_WITHHOLDING_TAX_CONSULTANCY + "," + UPDATED_WITHHOLDING_TAX_CONSULTANCY);

        // Get all the taxRuleList where withholdingTaxConsultancy equals to UPDATED_WITHHOLDING_TAX_CONSULTANCY
        defaultTaxRuleShouldNotBeFound("withholdingTaxConsultancy.in=" + UPDATED_WITHHOLDING_TAX_CONSULTANCY);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByWithholdingTaxConsultancyIsNullOrNotNull() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where withholdingTaxConsultancy is not null
        defaultTaxRuleShouldBeFound("withholdingTaxConsultancy.specified=true");

        // Get all the taxRuleList where withholdingTaxConsultancy is null
        defaultTaxRuleShouldNotBeFound("withholdingTaxConsultancy.specified=false");
    }

    @Test
    @Transactional
    public void getAllTaxRulesByWithholdingTaxConsultancyIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where withholdingTaxConsultancy is greater than or equal to DEFAULT_WITHHOLDING_TAX_CONSULTANCY
        defaultTaxRuleShouldBeFound("withholdingTaxConsultancy.greaterThanOrEqual=" + DEFAULT_WITHHOLDING_TAX_CONSULTANCY);

        // Get all the taxRuleList where withholdingTaxConsultancy is greater than or equal to UPDATED_WITHHOLDING_TAX_CONSULTANCY
        defaultTaxRuleShouldNotBeFound("withholdingTaxConsultancy.greaterThanOrEqual=" + UPDATED_WITHHOLDING_TAX_CONSULTANCY);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByWithholdingTaxConsultancyIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where withholdingTaxConsultancy is less than or equal to DEFAULT_WITHHOLDING_TAX_CONSULTANCY
        defaultTaxRuleShouldBeFound("withholdingTaxConsultancy.lessThanOrEqual=" + DEFAULT_WITHHOLDING_TAX_CONSULTANCY);

        // Get all the taxRuleList where withholdingTaxConsultancy is less than or equal to SMALLER_WITHHOLDING_TAX_CONSULTANCY
        defaultTaxRuleShouldNotBeFound("withholdingTaxConsultancy.lessThanOrEqual=" + SMALLER_WITHHOLDING_TAX_CONSULTANCY);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByWithholdingTaxConsultancyIsLessThanSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where withholdingTaxConsultancy is less than DEFAULT_WITHHOLDING_TAX_CONSULTANCY
        defaultTaxRuleShouldNotBeFound("withholdingTaxConsultancy.lessThan=" + DEFAULT_WITHHOLDING_TAX_CONSULTANCY);

        // Get all the taxRuleList where withholdingTaxConsultancy is less than UPDATED_WITHHOLDING_TAX_CONSULTANCY
        defaultTaxRuleShouldBeFound("withholdingTaxConsultancy.lessThan=" + UPDATED_WITHHOLDING_TAX_CONSULTANCY);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByWithholdingTaxConsultancyIsGreaterThanSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where withholdingTaxConsultancy is greater than DEFAULT_WITHHOLDING_TAX_CONSULTANCY
        defaultTaxRuleShouldNotBeFound("withholdingTaxConsultancy.greaterThan=" + DEFAULT_WITHHOLDING_TAX_CONSULTANCY);

        // Get all the taxRuleList where withholdingTaxConsultancy is greater than SMALLER_WITHHOLDING_TAX_CONSULTANCY
        defaultTaxRuleShouldBeFound("withholdingTaxConsultancy.greaterThan=" + SMALLER_WITHHOLDING_TAX_CONSULTANCY);
    }


    @Test
    @Transactional
    public void getAllTaxRulesByWithholdingTaxRentIsEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where withholdingTaxRent equals to DEFAULT_WITHHOLDING_TAX_RENT
        defaultTaxRuleShouldBeFound("withholdingTaxRent.equals=" + DEFAULT_WITHHOLDING_TAX_RENT);

        // Get all the taxRuleList where withholdingTaxRent equals to UPDATED_WITHHOLDING_TAX_RENT
        defaultTaxRuleShouldNotBeFound("withholdingTaxRent.equals=" + UPDATED_WITHHOLDING_TAX_RENT);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByWithholdingTaxRentIsNotEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where withholdingTaxRent not equals to DEFAULT_WITHHOLDING_TAX_RENT
        defaultTaxRuleShouldNotBeFound("withholdingTaxRent.notEquals=" + DEFAULT_WITHHOLDING_TAX_RENT);

        // Get all the taxRuleList where withholdingTaxRent not equals to UPDATED_WITHHOLDING_TAX_RENT
        defaultTaxRuleShouldBeFound("withholdingTaxRent.notEquals=" + UPDATED_WITHHOLDING_TAX_RENT);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByWithholdingTaxRentIsInShouldWork() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where withholdingTaxRent in DEFAULT_WITHHOLDING_TAX_RENT or UPDATED_WITHHOLDING_TAX_RENT
        defaultTaxRuleShouldBeFound("withholdingTaxRent.in=" + DEFAULT_WITHHOLDING_TAX_RENT + "," + UPDATED_WITHHOLDING_TAX_RENT);

        // Get all the taxRuleList where withholdingTaxRent equals to UPDATED_WITHHOLDING_TAX_RENT
        defaultTaxRuleShouldNotBeFound("withholdingTaxRent.in=" + UPDATED_WITHHOLDING_TAX_RENT);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByWithholdingTaxRentIsNullOrNotNull() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where withholdingTaxRent is not null
        defaultTaxRuleShouldBeFound("withholdingTaxRent.specified=true");

        // Get all the taxRuleList where withholdingTaxRent is null
        defaultTaxRuleShouldNotBeFound("withholdingTaxRent.specified=false");
    }

    @Test
    @Transactional
    public void getAllTaxRulesByWithholdingTaxRentIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where withholdingTaxRent is greater than or equal to DEFAULT_WITHHOLDING_TAX_RENT
        defaultTaxRuleShouldBeFound("withholdingTaxRent.greaterThanOrEqual=" + DEFAULT_WITHHOLDING_TAX_RENT);

        // Get all the taxRuleList where withholdingTaxRent is greater than or equal to UPDATED_WITHHOLDING_TAX_RENT
        defaultTaxRuleShouldNotBeFound("withholdingTaxRent.greaterThanOrEqual=" + UPDATED_WITHHOLDING_TAX_RENT);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByWithholdingTaxRentIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where withholdingTaxRent is less than or equal to DEFAULT_WITHHOLDING_TAX_RENT
        defaultTaxRuleShouldBeFound("withholdingTaxRent.lessThanOrEqual=" + DEFAULT_WITHHOLDING_TAX_RENT);

        // Get all the taxRuleList where withholdingTaxRent is less than or equal to SMALLER_WITHHOLDING_TAX_RENT
        defaultTaxRuleShouldNotBeFound("withholdingTaxRent.lessThanOrEqual=" + SMALLER_WITHHOLDING_TAX_RENT);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByWithholdingTaxRentIsLessThanSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where withholdingTaxRent is less than DEFAULT_WITHHOLDING_TAX_RENT
        defaultTaxRuleShouldNotBeFound("withholdingTaxRent.lessThan=" + DEFAULT_WITHHOLDING_TAX_RENT);

        // Get all the taxRuleList where withholdingTaxRent is less than UPDATED_WITHHOLDING_TAX_RENT
        defaultTaxRuleShouldBeFound("withholdingTaxRent.lessThan=" + UPDATED_WITHHOLDING_TAX_RENT);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByWithholdingTaxRentIsGreaterThanSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where withholdingTaxRent is greater than DEFAULT_WITHHOLDING_TAX_RENT
        defaultTaxRuleShouldNotBeFound("withholdingTaxRent.greaterThan=" + DEFAULT_WITHHOLDING_TAX_RENT);

        // Get all the taxRuleList where withholdingTaxRent is greater than SMALLER_WITHHOLDING_TAX_RENT
        defaultTaxRuleShouldBeFound("withholdingTaxRent.greaterThan=" + SMALLER_WITHHOLDING_TAX_RENT);
    }


    @Test
    @Transactional
    public void getAllTaxRulesByCateringLevyIsEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where cateringLevy equals to DEFAULT_CATERING_LEVY
        defaultTaxRuleShouldBeFound("cateringLevy.equals=" + DEFAULT_CATERING_LEVY);

        // Get all the taxRuleList where cateringLevy equals to UPDATED_CATERING_LEVY
        defaultTaxRuleShouldNotBeFound("cateringLevy.equals=" + UPDATED_CATERING_LEVY);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByCateringLevyIsNotEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where cateringLevy not equals to DEFAULT_CATERING_LEVY
        defaultTaxRuleShouldNotBeFound("cateringLevy.notEquals=" + DEFAULT_CATERING_LEVY);

        // Get all the taxRuleList where cateringLevy not equals to UPDATED_CATERING_LEVY
        defaultTaxRuleShouldBeFound("cateringLevy.notEquals=" + UPDATED_CATERING_LEVY);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByCateringLevyIsInShouldWork() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where cateringLevy in DEFAULT_CATERING_LEVY or UPDATED_CATERING_LEVY
        defaultTaxRuleShouldBeFound("cateringLevy.in=" + DEFAULT_CATERING_LEVY + "," + UPDATED_CATERING_LEVY);

        // Get all the taxRuleList where cateringLevy equals to UPDATED_CATERING_LEVY
        defaultTaxRuleShouldNotBeFound("cateringLevy.in=" + UPDATED_CATERING_LEVY);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByCateringLevyIsNullOrNotNull() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where cateringLevy is not null
        defaultTaxRuleShouldBeFound("cateringLevy.specified=true");

        // Get all the taxRuleList where cateringLevy is null
        defaultTaxRuleShouldNotBeFound("cateringLevy.specified=false");
    }

    @Test
    @Transactional
    public void getAllTaxRulesByCateringLevyIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where cateringLevy is greater than or equal to DEFAULT_CATERING_LEVY
        defaultTaxRuleShouldBeFound("cateringLevy.greaterThanOrEqual=" + DEFAULT_CATERING_LEVY);

        // Get all the taxRuleList where cateringLevy is greater than or equal to UPDATED_CATERING_LEVY
        defaultTaxRuleShouldNotBeFound("cateringLevy.greaterThanOrEqual=" + UPDATED_CATERING_LEVY);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByCateringLevyIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where cateringLevy is less than or equal to DEFAULT_CATERING_LEVY
        defaultTaxRuleShouldBeFound("cateringLevy.lessThanOrEqual=" + DEFAULT_CATERING_LEVY);

        // Get all the taxRuleList where cateringLevy is less than or equal to SMALLER_CATERING_LEVY
        defaultTaxRuleShouldNotBeFound("cateringLevy.lessThanOrEqual=" + SMALLER_CATERING_LEVY);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByCateringLevyIsLessThanSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where cateringLevy is less than DEFAULT_CATERING_LEVY
        defaultTaxRuleShouldNotBeFound("cateringLevy.lessThan=" + DEFAULT_CATERING_LEVY);

        // Get all the taxRuleList where cateringLevy is less than UPDATED_CATERING_LEVY
        defaultTaxRuleShouldBeFound("cateringLevy.lessThan=" + UPDATED_CATERING_LEVY);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByCateringLevyIsGreaterThanSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where cateringLevy is greater than DEFAULT_CATERING_LEVY
        defaultTaxRuleShouldNotBeFound("cateringLevy.greaterThan=" + DEFAULT_CATERING_LEVY);

        // Get all the taxRuleList where cateringLevy is greater than SMALLER_CATERING_LEVY
        defaultTaxRuleShouldBeFound("cateringLevy.greaterThan=" + SMALLER_CATERING_LEVY);
    }


    @Test
    @Transactional
    public void getAllTaxRulesByServiceChargeIsEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where serviceCharge equals to DEFAULT_SERVICE_CHARGE
        defaultTaxRuleShouldBeFound("serviceCharge.equals=" + DEFAULT_SERVICE_CHARGE);

        // Get all the taxRuleList where serviceCharge equals to UPDATED_SERVICE_CHARGE
        defaultTaxRuleShouldNotBeFound("serviceCharge.equals=" + UPDATED_SERVICE_CHARGE);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByServiceChargeIsNotEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where serviceCharge not equals to DEFAULT_SERVICE_CHARGE
        defaultTaxRuleShouldNotBeFound("serviceCharge.notEquals=" + DEFAULT_SERVICE_CHARGE);

        // Get all the taxRuleList where serviceCharge not equals to UPDATED_SERVICE_CHARGE
        defaultTaxRuleShouldBeFound("serviceCharge.notEquals=" + UPDATED_SERVICE_CHARGE);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByServiceChargeIsInShouldWork() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where serviceCharge in DEFAULT_SERVICE_CHARGE or UPDATED_SERVICE_CHARGE
        defaultTaxRuleShouldBeFound("serviceCharge.in=" + DEFAULT_SERVICE_CHARGE + "," + UPDATED_SERVICE_CHARGE);

        // Get all the taxRuleList where serviceCharge equals to UPDATED_SERVICE_CHARGE
        defaultTaxRuleShouldNotBeFound("serviceCharge.in=" + UPDATED_SERVICE_CHARGE);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByServiceChargeIsNullOrNotNull() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where serviceCharge is not null
        defaultTaxRuleShouldBeFound("serviceCharge.specified=true");

        // Get all the taxRuleList where serviceCharge is null
        defaultTaxRuleShouldNotBeFound("serviceCharge.specified=false");
    }

    @Test
    @Transactional
    public void getAllTaxRulesByServiceChargeIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where serviceCharge is greater than or equal to DEFAULT_SERVICE_CHARGE
        defaultTaxRuleShouldBeFound("serviceCharge.greaterThanOrEqual=" + DEFAULT_SERVICE_CHARGE);

        // Get all the taxRuleList where serviceCharge is greater than or equal to UPDATED_SERVICE_CHARGE
        defaultTaxRuleShouldNotBeFound("serviceCharge.greaterThanOrEqual=" + UPDATED_SERVICE_CHARGE);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByServiceChargeIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where serviceCharge is less than or equal to DEFAULT_SERVICE_CHARGE
        defaultTaxRuleShouldBeFound("serviceCharge.lessThanOrEqual=" + DEFAULT_SERVICE_CHARGE);

        // Get all the taxRuleList where serviceCharge is less than or equal to SMALLER_SERVICE_CHARGE
        defaultTaxRuleShouldNotBeFound("serviceCharge.lessThanOrEqual=" + SMALLER_SERVICE_CHARGE);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByServiceChargeIsLessThanSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where serviceCharge is less than DEFAULT_SERVICE_CHARGE
        defaultTaxRuleShouldNotBeFound("serviceCharge.lessThan=" + DEFAULT_SERVICE_CHARGE);

        // Get all the taxRuleList where serviceCharge is less than UPDATED_SERVICE_CHARGE
        defaultTaxRuleShouldBeFound("serviceCharge.lessThan=" + UPDATED_SERVICE_CHARGE);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByServiceChargeIsGreaterThanSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where serviceCharge is greater than DEFAULT_SERVICE_CHARGE
        defaultTaxRuleShouldNotBeFound("serviceCharge.greaterThan=" + DEFAULT_SERVICE_CHARGE);

        // Get all the taxRuleList where serviceCharge is greater than SMALLER_SERVICE_CHARGE
        defaultTaxRuleShouldBeFound("serviceCharge.greaterThan=" + SMALLER_SERVICE_CHARGE);
    }


    @Test
    @Transactional
    public void getAllTaxRulesByWithholdingTaxImportedServiceIsEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where withholdingTaxImportedService equals to DEFAULT_WITHHOLDING_TAX_IMPORTED_SERVICE
        defaultTaxRuleShouldBeFound("withholdingTaxImportedService.equals=" + DEFAULT_WITHHOLDING_TAX_IMPORTED_SERVICE);

        // Get all the taxRuleList where withholdingTaxImportedService equals to UPDATED_WITHHOLDING_TAX_IMPORTED_SERVICE
        defaultTaxRuleShouldNotBeFound("withholdingTaxImportedService.equals=" + UPDATED_WITHHOLDING_TAX_IMPORTED_SERVICE);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByWithholdingTaxImportedServiceIsNotEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where withholdingTaxImportedService not equals to DEFAULT_WITHHOLDING_TAX_IMPORTED_SERVICE
        defaultTaxRuleShouldNotBeFound("withholdingTaxImportedService.notEquals=" + DEFAULT_WITHHOLDING_TAX_IMPORTED_SERVICE);

        // Get all the taxRuleList where withholdingTaxImportedService not equals to UPDATED_WITHHOLDING_TAX_IMPORTED_SERVICE
        defaultTaxRuleShouldBeFound("withholdingTaxImportedService.notEquals=" + UPDATED_WITHHOLDING_TAX_IMPORTED_SERVICE);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByWithholdingTaxImportedServiceIsInShouldWork() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where withholdingTaxImportedService in DEFAULT_WITHHOLDING_TAX_IMPORTED_SERVICE or UPDATED_WITHHOLDING_TAX_IMPORTED_SERVICE
        defaultTaxRuleShouldBeFound("withholdingTaxImportedService.in=" + DEFAULT_WITHHOLDING_TAX_IMPORTED_SERVICE + "," + UPDATED_WITHHOLDING_TAX_IMPORTED_SERVICE);

        // Get all the taxRuleList where withholdingTaxImportedService equals to UPDATED_WITHHOLDING_TAX_IMPORTED_SERVICE
        defaultTaxRuleShouldNotBeFound("withholdingTaxImportedService.in=" + UPDATED_WITHHOLDING_TAX_IMPORTED_SERVICE);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByWithholdingTaxImportedServiceIsNullOrNotNull() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where withholdingTaxImportedService is not null
        defaultTaxRuleShouldBeFound("withholdingTaxImportedService.specified=true");

        // Get all the taxRuleList where withholdingTaxImportedService is null
        defaultTaxRuleShouldNotBeFound("withholdingTaxImportedService.specified=false");
    }

    @Test
    @Transactional
    public void getAllTaxRulesByWithholdingTaxImportedServiceIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where withholdingTaxImportedService is greater than or equal to DEFAULT_WITHHOLDING_TAX_IMPORTED_SERVICE
        defaultTaxRuleShouldBeFound("withholdingTaxImportedService.greaterThanOrEqual=" + DEFAULT_WITHHOLDING_TAX_IMPORTED_SERVICE);

        // Get all the taxRuleList where withholdingTaxImportedService is greater than or equal to UPDATED_WITHHOLDING_TAX_IMPORTED_SERVICE
        defaultTaxRuleShouldNotBeFound("withholdingTaxImportedService.greaterThanOrEqual=" + UPDATED_WITHHOLDING_TAX_IMPORTED_SERVICE);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByWithholdingTaxImportedServiceIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where withholdingTaxImportedService is less than or equal to DEFAULT_WITHHOLDING_TAX_IMPORTED_SERVICE
        defaultTaxRuleShouldBeFound("withholdingTaxImportedService.lessThanOrEqual=" + DEFAULT_WITHHOLDING_TAX_IMPORTED_SERVICE);

        // Get all the taxRuleList where withholdingTaxImportedService is less than or equal to SMALLER_WITHHOLDING_TAX_IMPORTED_SERVICE
        defaultTaxRuleShouldNotBeFound("withholdingTaxImportedService.lessThanOrEqual=" + SMALLER_WITHHOLDING_TAX_IMPORTED_SERVICE);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByWithholdingTaxImportedServiceIsLessThanSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where withholdingTaxImportedService is less than DEFAULT_WITHHOLDING_TAX_IMPORTED_SERVICE
        defaultTaxRuleShouldNotBeFound("withholdingTaxImportedService.lessThan=" + DEFAULT_WITHHOLDING_TAX_IMPORTED_SERVICE);

        // Get all the taxRuleList where withholdingTaxImportedService is less than UPDATED_WITHHOLDING_TAX_IMPORTED_SERVICE
        defaultTaxRuleShouldBeFound("withholdingTaxImportedService.lessThan=" + UPDATED_WITHHOLDING_TAX_IMPORTED_SERVICE);
    }

    @Test
    @Transactional
    public void getAllTaxRulesByWithholdingTaxImportedServiceIsGreaterThanSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        // Get all the taxRuleList where withholdingTaxImportedService is greater than DEFAULT_WITHHOLDING_TAX_IMPORTED_SERVICE
        defaultTaxRuleShouldNotBeFound("withholdingTaxImportedService.greaterThan=" + DEFAULT_WITHHOLDING_TAX_IMPORTED_SERVICE);

        // Get all the taxRuleList where withholdingTaxImportedService is greater than SMALLER_WITHHOLDING_TAX_IMPORTED_SERVICE
        defaultTaxRuleShouldBeFound("withholdingTaxImportedService.greaterThan=" + SMALLER_WITHHOLDING_TAX_IMPORTED_SERVICE);
    }


    @Test
    @Transactional
    public void getAllTaxRulesByPaymentIsEqualToSomething() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);
        Payment payment = PaymentResourceIT.createEntity(em);
        em.persist(payment);
        em.flush();
        taxRule.setPayment(payment);
        payment.setTaxRule(taxRule);
        taxRuleRepository.saveAndFlush(taxRule);
        Long paymentId = payment.getId();

        // Get all the taxRuleList where payment equals to paymentId
        defaultTaxRuleShouldBeFound("paymentId.equals=" + paymentId);

        // Get all the taxRuleList where payment equals to paymentId + 1
        defaultTaxRuleShouldNotBeFound("paymentId.equals=" + (paymentId + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultTaxRuleShouldBeFound(String filter) throws Exception {
        restTaxRuleMockMvc.perform(get("/api/tax-rules?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(taxRule.getId().intValue())))
            .andExpect(jsonPath("$.[*].paymentNumber").value(hasItem(DEFAULT_PAYMENT_NUMBER)))
            .andExpect(jsonPath("$.[*].paymentDate").value(hasItem(DEFAULT_PAYMENT_DATE.toString())))
            .andExpect(jsonPath("$.[*].telcoExciseDuty").value(hasItem(DEFAULT_TELCO_EXCISE_DUTY.doubleValue())))
            .andExpect(jsonPath("$.[*].valueAddedTax").value(hasItem(DEFAULT_VALUE_ADDED_TAX.doubleValue())))
            .andExpect(jsonPath("$.[*].withholdingVAT").value(hasItem(DEFAULT_WITHHOLDING_VAT.doubleValue())))
            .andExpect(jsonPath("$.[*].withholdingTaxConsultancy").value(hasItem(DEFAULT_WITHHOLDING_TAX_CONSULTANCY.doubleValue())))
            .andExpect(jsonPath("$.[*].withholdingTaxRent").value(hasItem(DEFAULT_WITHHOLDING_TAX_RENT.doubleValue())))
            .andExpect(jsonPath("$.[*].cateringLevy").value(hasItem(DEFAULT_CATERING_LEVY.doubleValue())))
            .andExpect(jsonPath("$.[*].serviceCharge").value(hasItem(DEFAULT_SERVICE_CHARGE.doubleValue())))
            .andExpect(jsonPath("$.[*].withholdingTaxImportedService").value(hasItem(DEFAULT_WITHHOLDING_TAX_IMPORTED_SERVICE.doubleValue())));

        // Check, that the count call also returns 1
        restTaxRuleMockMvc.perform(get("/api/tax-rules/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultTaxRuleShouldNotBeFound(String filter) throws Exception {
        restTaxRuleMockMvc.perform(get("/api/tax-rules?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restTaxRuleMockMvc.perform(get("/api/tax-rules/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    public void getNonExistingTaxRule() throws Exception {
        // Get the taxRule
        restTaxRuleMockMvc.perform(get("/api/tax-rules/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTaxRule() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        int databaseSizeBeforeUpdate = taxRuleRepository.findAll().size();

        // Update the taxRule
        TaxRule updatedTaxRule = taxRuleRepository.findById(taxRule.getId()).get();
        // Disconnect from session so that the updates on updatedTaxRule are not directly saved in db
        em.detach(updatedTaxRule);
        updatedTaxRule
            .paymentNumber(UPDATED_PAYMENT_NUMBER)
            .paymentDate(UPDATED_PAYMENT_DATE)
            .telcoExciseDuty(UPDATED_TELCO_EXCISE_DUTY)
            .valueAddedTax(UPDATED_VALUE_ADDED_TAX)
            .withholdingVAT(UPDATED_WITHHOLDING_VAT)
            .withholdingTaxConsultancy(UPDATED_WITHHOLDING_TAX_CONSULTANCY)
            .withholdingTaxRent(UPDATED_WITHHOLDING_TAX_RENT)
            .cateringLevy(UPDATED_CATERING_LEVY)
            .serviceCharge(UPDATED_SERVICE_CHARGE)
            .withholdingTaxImportedService(UPDATED_WITHHOLDING_TAX_IMPORTED_SERVICE);
        TaxRuleDTO taxRuleDTO = taxRuleMapper.toDto(updatedTaxRule);

        restTaxRuleMockMvc.perform(put("/api/tax-rules").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(taxRuleDTO)))
            .andExpect(status().isOk());

        // Validate the TaxRule in the database
        List<TaxRule> taxRuleList = taxRuleRepository.findAll();
        assertThat(taxRuleList).hasSize(databaseSizeBeforeUpdate);
        TaxRule testTaxRule = taxRuleList.get(taxRuleList.size() - 1);
        assertThat(testTaxRule.getPaymentNumber()).isEqualTo(UPDATED_PAYMENT_NUMBER);
        assertThat(testTaxRule.getPaymentDate()).isEqualTo(UPDATED_PAYMENT_DATE);
        assertThat(testTaxRule.getTelcoExciseDuty()).isEqualTo(UPDATED_TELCO_EXCISE_DUTY);
        assertThat(testTaxRule.getValueAddedTax()).isEqualTo(UPDATED_VALUE_ADDED_TAX);
        assertThat(testTaxRule.getWithholdingVAT()).isEqualTo(UPDATED_WITHHOLDING_VAT);
        assertThat(testTaxRule.getWithholdingTaxConsultancy()).isEqualTo(UPDATED_WITHHOLDING_TAX_CONSULTANCY);
        assertThat(testTaxRule.getWithholdingTaxRent()).isEqualTo(UPDATED_WITHHOLDING_TAX_RENT);
        assertThat(testTaxRule.getCateringLevy()).isEqualTo(UPDATED_CATERING_LEVY);
        assertThat(testTaxRule.getServiceCharge()).isEqualTo(UPDATED_SERVICE_CHARGE);
        assertThat(testTaxRule.getWithholdingTaxImportedService()).isEqualTo(UPDATED_WITHHOLDING_TAX_IMPORTED_SERVICE);

        // Validate the TaxRule in Elasticsearch
        verify(mockTaxRuleSearchRepository, times(1)).save(testTaxRule);
    }

    @Test
    @Transactional
    public void updateNonExistingTaxRule() throws Exception {
        int databaseSizeBeforeUpdate = taxRuleRepository.findAll().size();

        // Create the TaxRule
        TaxRuleDTO taxRuleDTO = taxRuleMapper.toDto(taxRule);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTaxRuleMockMvc.perform(put("/api/tax-rules").with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(taxRuleDTO)))
            .andExpect(status().isBadRequest());

        // Validate the TaxRule in the database
        List<TaxRule> taxRuleList = taxRuleRepository.findAll();
        assertThat(taxRuleList).hasSize(databaseSizeBeforeUpdate);

        // Validate the TaxRule in Elasticsearch
        verify(mockTaxRuleSearchRepository, times(0)).save(taxRule);
    }

    @Test
    @Transactional
    public void deleteTaxRule() throws Exception {
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);

        int databaseSizeBeforeDelete = taxRuleRepository.findAll().size();

        // Delete the taxRule
        restTaxRuleMockMvc.perform(delete("/api/tax-rules/{id}", taxRule.getId()).with(csrf())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<TaxRule> taxRuleList = taxRuleRepository.findAll();
        assertThat(taxRuleList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the TaxRule in Elasticsearch
        verify(mockTaxRuleSearchRepository, times(1)).deleteById(taxRule.getId());
    }

    @Test
    @Transactional
    public void searchTaxRule() throws Exception {
        // Configure the mock search repository
        // Initialize the database
        taxRuleRepository.saveAndFlush(taxRule);
        when(mockTaxRuleSearchRepository.search(queryStringQuery("id:" + taxRule.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(taxRule), PageRequest.of(0, 1), 1));

        // Search the taxRule
        restTaxRuleMockMvc.perform(get("/api/_search/tax-rules?query=id:" + taxRule.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(taxRule.getId().intValue())))
            .andExpect(jsonPath("$.[*].paymentNumber").value(hasItem(DEFAULT_PAYMENT_NUMBER)))
            .andExpect(jsonPath("$.[*].paymentDate").value(hasItem(DEFAULT_PAYMENT_DATE.toString())))
            .andExpect(jsonPath("$.[*].telcoExciseDuty").value(hasItem(DEFAULT_TELCO_EXCISE_DUTY.doubleValue())))
            .andExpect(jsonPath("$.[*].valueAddedTax").value(hasItem(DEFAULT_VALUE_ADDED_TAX.doubleValue())))
            .andExpect(jsonPath("$.[*].withholdingVAT").value(hasItem(DEFAULT_WITHHOLDING_VAT.doubleValue())))
            .andExpect(jsonPath("$.[*].withholdingTaxConsultancy").value(hasItem(DEFAULT_WITHHOLDING_TAX_CONSULTANCY.doubleValue())))
            .andExpect(jsonPath("$.[*].withholdingTaxRent").value(hasItem(DEFAULT_WITHHOLDING_TAX_RENT.doubleValue())))
            .andExpect(jsonPath("$.[*].cateringLevy").value(hasItem(DEFAULT_CATERING_LEVY.doubleValue())))
            .andExpect(jsonPath("$.[*].serviceCharge").value(hasItem(DEFAULT_SERVICE_CHARGE.doubleValue())))
            .andExpect(jsonPath("$.[*].withholdingTaxImportedService").value(hasItem(DEFAULT_WITHHOLDING_TAX_IMPORTED_SERVICE.doubleValue())));
    }
}