import { useData } from '../../context/DataContext';
import { formatCurrency } from '../../utils/formatters';
import { FaTrash, FaEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';

function AssetList() {
    const { assets, deleteAsset } = useData();

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this asset?")) {
            try {
                await deleteAsset(id);
                toast.success('Asset deleted successfully!');
            } catch (error) {
                toast.error('Failed to delete asset.');
                console.error(error);
            }
        }
    };

    return (
        <div className="p-4 bg-slate-50 rounded-lg shadow-inner">
            <h4 className="font-semibold text-slate-700 mb-4">Your Assets</h4>
            {assets.length === 0 ? (
                <p className="text-sm text-slate-500 text-center">No assets added yet.</p>
            ) : (
                <ul className="space-y-3">
                    {assets.map(asset => (
                        <li key={asset.id} className="group flex justify-between items-center p-3 bg-white rounded-md shadow-sm">
                            <div>
                                <p className="font-medium text-slate-800">{asset.name}</p>
                                {/* IBAN sadece varsa gösterilir, bu zaten doğruydu. */}
                                {asset.iban && (
                                    <p className="text-xs text-slate-500 font-mono">{asset.iban}</p>
                                )}
                                <p className="text-xs text-slate-500">{asset.type}</p>
                            </div>
                            <div className="flex items-center">
                                
                                {/* --- DÜZENLEME BURADA --- */}
                                {/* Değeri sadece varlık tipi "Banka Hesabı" DEĞİLSE göster */}
                                {asset.type !== 'Bank Account' && (
                                    <span className="font-bold text-slate-700 mr-4">
                                        {formatCurrency(asset.currentValue)}
                                    </span>
                                )}
                                {/* ----------------------- */}

                                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="text-slate-400 hover:text-blue-600">
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => handleDelete(asset.id)} className="text-slate-400 hover:text-red-600">
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AssetList;