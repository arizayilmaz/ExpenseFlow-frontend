import { useState, type FormEvent } from 'react';
import { useData } from '../../context/DataContext';
import toast from 'react-hot-toast';

const assetTypeOptions = [
    { value: 'Bank Account', label: 'Bank Account' },
    { value: 'Cash', label: 'Cash' },
    { value: 'Real Estate', label: 'Real Estate' },
    { value: 'Other', label: 'Other' },
];

const turkishBanks = ["Akbank", "Garanti BBVA", "İş Bankası", "Yapı Kredi", "Ziraat Bankası", "Halkbank", "VakıfBank", "Other"];

function AssetForm() {
    const { addAsset } = useData();

    const [type, setType] = useState('Bank Account');
    
    const [selectedBank, setSelectedBank] = useState(turkishBanks[0]);
    const [customBankName, setCustomBankName] = useState('');
    const [iban, setIban] = useState('');
    
    const [genericAssetName, setGenericAssetName] = useState('');
    const [currentValue, setCurrentValue] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const isBankAccount = type === 'Bank Account';
        let finalName;
        let finalValue = 0;

        if (isBankAccount) {
            const bankName = selectedBank === 'Other' ? customBankName : selectedBank;
            finalName = `${bankName} (${iban})`; 
        } else {
            finalName = genericAssetName;
            finalValue = parseFloat(currentValue);
        }

        if (!finalName || (isBankAccount && !iban) || (!isBankAccount && !currentValue)) {
            toast.error('Please fill all required fields!');
            return;
        }

        try {
            const assetData = {
                name: finalName,
                type: type,
                currentValue: finalValue,
                iban: isBankAccount ? iban : undefined,
            };
            
            await addAsset(assetData);
            toast.success('Asset added successfully!');

            setType('Bank Account');
            setSelectedBank(turkishBanks[0]);
            setCustomBankName('');
            setIban('');
            setGenericAssetName('');
            setCurrentValue('');

        } catch (error) {
            toast.error('Failed to add asset.');
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-slate-50 rounded-lg shadow-inner space-y-4">
            <h4 className="font-semibold text-slate-700">Add New Asset</h4>
            
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md">
                {assetTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>

            {type === 'Bank Account' && (
                <>
                    <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md">
                        {turkishBanks.map(bank => <option key={bank} value={bank}>{bank}</option>)}
                    </select>
                    
                    {selectedBank === 'Other' && (
                        <input type="text" value={customBankName} onChange={(e) => setCustomBankName(e.target.value)} placeholder="Enter Bank Name" className="w-full p-2 border border-slate-300 rounded-md"/>
                    )}

                    <input type="text" value={iban} onChange={(e) => setIban(e.target.value)} placeholder="IBAN (e.g., TR...)" className="w-full p-2 border border-slate-300 rounded-md"/>
                </>
            )}

            {type !== 'Bank Account' && (
                <>
                    <input type="text" value={genericAssetName} onChange={(e) => setGenericAssetName(e.target.value)} placeholder="Asset Name (e.g., My Wallet)" className="w-full p-2 border border-slate-300 rounded-md"/>
                    <input type="number" value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} placeholder="Current Value (in USD)" className="w-full p-2 border border-slate-300 rounded-md"/>
                </>
            )}
            
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 font-semibold">
                Add Asset
            </button>
        </form>
    );
}

export default AssetForm;