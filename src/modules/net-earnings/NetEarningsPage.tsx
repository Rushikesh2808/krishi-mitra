import React from 'react';
import {
  DetailedExpenseInputs,
  calculateDetailedNetEarnings,
  getDefaultMandiExpenseInputs,
  computeMandiComparisons
} from '../../utils/calculations';
import { MOCK_CROPS } from '../../data/mockData';
import { useLanguage } from '../../context/LanguageContext';
import { CalculatorInputForm } from './components/CalculatorInputForm';
import { FinancialSummaryCard } from './components/FinancialSummaryCard';
import { ExpenseDistributionChart } from './components/ExpenseDistributionChart';
import { MandiEarningsComparisonGrid } from './components/MandiEarningsComparisonGrid';
import { Calculator, ShieldAlert, TrendingUp, Store, ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const NetEarningsPage: React.FC = () => {
  const { language, t } = useLanguage();
  // 1. Initial State: Loaded with Lasalgaon APMC defaults for 50 Qtl of Soybean
  const [inputs, setInputs] = React.useState<DetailedExpenseInputs>(() =>
    getDefaultMandiExpenseInputs('crop-soybean', 'm-lasalgaon', 50, 'v-niphad')
  );

  // Active crop metadata
  const activeCrop = MOCK_CROPS.find((c) => c.id === inputs.cropId) || MOCK_CROPS[0];

  // 2. Compute Real-time Calculations
  const result = React.useMemo(() => {
    return calculateDetailedNetEarnings(inputs);
  }, [inputs]);

  // 3. Compute Mandi Comparison Benchmark across all 6 APMC mandis
  const mandiBenchmarkEntries = React.useMemo(() => {
    return computeMandiComparisons(inputs.cropId, inputs.quantityQuintals, 'v-niphad');
  }, [inputs.cropId, inputs.quantityQuintals]);

  // Handler for individual field edits
  const handleInputChange = (field: keyof DetailedExpenseInputs, value: number | string) => {
    if (field === 'cropId') {
      const newCropId = value as string;
      setInputs(getDefaultMandiExpenseInputs(newCropId, inputs.mandiId, inputs.quantityQuintals, 'v-niphad'));
    } else if (field === 'mandiId') {
      const newMandiId = value as string;
      setInputs(getDefaultMandiExpenseInputs(inputs.cropId, newMandiId, inputs.quantityQuintals, 'v-niphad'));
    } else if (field === 'quantityQuintals') {
      const newQty = Math.max(1, typeof value === 'number' ? value : parseInt(value) || 1);
      setInputs(getDefaultMandiExpenseInputs(inputs.cropId, inputs.mandiId, newQty, 'v-niphad'));
    } else {
      setInputs((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Reset to default calculated APMC expenses
  const handleResetDefaults = () => {
    setInputs(getDefaultMandiExpenseInputs(inputs.cropId, inputs.mandiId, inputs.quantityQuintals, 'v-niphad'));
  };

  // Clear all expense fields to zero
  const handleZeroExpenses = () => {
    setInputs((prev) => ({
      ...prev,
      transportCost: 0,
      loadingUnloadingCost: 0,
      storageCost: 0,
      labourCost: 0,
      marketFees: 0,
      miscellaneousCost: 0,
    }));
  };

  // Load a specific mandi's rates from the benchmark grid
  const handleSelectMandiFromGrid = (mandiId: string) => {
    setInputs(getDefaultMandiExpenseInputs(inputs.cropId, mandiId, inputs.quantityQuintals, 'v-niphad'));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-purple-700" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('calculator.title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {t('calculator.subtitle')}
            </p>
          </div>
        </div>

        {/* Prototype Transparency Tag */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-xs font-semibold text-amber-800 self-start sm:self-auto">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Transparent Financial Modeling</span>
        </div>
      </div>

      {/* 1. Primary Inputs Form */}
      <CalculatorInputForm
        inputs={inputs}
        onInputChange={handleInputChange}
        onResetDefaults={handleResetDefaults}
        onZeroExpenses={handleZeroExpenses}
      />

      {/* 2. Realized Financial Summary & 3. Expense Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <FinancialSummaryCard
            result={result}
            quantityQuintals={inputs.quantityQuintals}
          />
        </div>

        <div className="lg:col-span-1">
          <ExpenseDistributionChart result={result} />
        </div>
      </div>

      {/* 4. Cross-Mandi Benchmark Grid */}
      <MandiEarningsComparisonGrid
        entries={mandiBenchmarkEntries}
        selectedMandiId={inputs.mandiId}
        onSelectMandi={handleSelectMandiFromGrid}
        cropName={activeCrop.name}
        quantityQuintals={inputs.quantityQuintals}
      />

      {/* Cross-Module Navigation Footer */}
      <div className="bg-earth-100/60 rounded-2xl p-4 sm:p-5 border border-earth-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-slate-700">
          <TrendingUp className="w-4 h-4 text-agri-700 shrink-0" />
          <span>
            Check whether holding your {inputs.quantityQuintals} Qtl {activeCrop.name} for 5 days yields higher net profit.
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <NavLink
            to="/sell-recommendations"
            className="inline-flex items-center space-x-1 px-3.5 py-2 rounded-xl bg-agri-700 hover:bg-agri-800 text-white font-semibold transition-all"
          >
            <span>Open Sell vs Wait Advisor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>
      </div>
    </div>
  );
};
