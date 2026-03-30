export default function InputField( { Label, Type, Placeholder, } ) {
    return (
        <div className="mb-3">
            <label className="block text-gray-700 font-medium mb-1">{Label}</label>
            <input
                type={Type}
                placeholder={Placeholder}
                className="w-full p-2 border border-gray-300 rounded"
            />
        </div>
    );
}