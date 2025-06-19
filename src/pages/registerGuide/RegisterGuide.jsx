import React, { useState } from 'react';
import { User, Mail, Lock, Phone, MapPin, Camera, GraduationCap, Globe, Award, FileText, Shield, CheckCircle, Upload, X } from 'lucide-react';
import './RegisterGuide.css';

function RegisterGuide() {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        avatar: '',
        major: '',
        language: '',
        yearExperience: '',
        numberOfGuidedTours: '',
        cccd: '',
        guideCertificate: '',
        healthCertificate: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadingFiles, setUploadingFiles] = useState({});

    // Cloudinary upload function
    const uploadToCloudinary = async (file, fieldName) => {
        const cloudName = 'dc4lgjkuh';
        const uploadPreset = 'userava';

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        try {
            setUploadingFiles(prev => ({ ...prev, [fieldName]: true }));

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error('Tải lên thất bại');
            }

            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error('Lỗi tải lên Cloudinary:', error);
            throw error;
        } finally {
            setUploadingFiles(prev => ({ ...prev, [fieldName]: false }));
        }
    };

    // Handle file upload
    const handleFileUpload = async (e, fieldName) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const fileTypes = {
            avatar: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
            guideCertificate: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'],
            healthCertificate: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']
        };

        if (fileTypes[fieldName] && !fileTypes[fieldName].includes(file.type)) {
            setErrors(prev => ({
                ...prev,
                [fieldName]: `Định dạng tệp không hợp lệ. Vui lòng tải lên ${fieldName === 'avatar' ? 'hình ảnh' : 'hình ảnh hoặc PDF'}.`
            }));
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            setErrors(prev => ({
                ...prev,
                [fieldName]: 'Dung lượng tệp phải nhỏ hơn 10MB.'
            }));
            return;
        }

        try {
            const uploadedUrl = await uploadToCloudinary(file, fieldName);
            setFormData(prev => ({ ...prev, [fieldName]: uploadedUrl }));
            setErrors(prev => ({ ...prev, [fieldName]: '' }));
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                [fieldName]: 'Tải lên thất bại. Vui lòng thử lại.'
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Họ và tên là bắt buộc';
        if (!formData.username.trim()) errors.username = 'Tên người dùng là bắt buộc';
        if (!formData.email.trim()) errors.email = 'Email là bắt buộc';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Định dạng email không hợp lệ';
        if (!formData.password) errors.password = 'Mật khẩu là bắt buộc';
        else if (formData.password.length < 8) errors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
        if (formData.phone && !/^\+?\d{10,15}$/.test(formData.phone)) errors.phone = 'Số điện thoại không hợp lệ (10-15 chữ số)';
        if (formData.avatar && !/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(formData.avatar) && !formData.avatar.includes('cloudinary.com')) errors.avatar = 'URL hình ảnh không hợp lệ';
        if (formData.yearExperience && (isNaN(formData.yearExperience) || formData.yearExperience < 0)) errors.yearExperience = 'Nhập số hợp lệ';
        if (formData.numberOfGuidedTours && (isNaN(formData.numberOfGuidedTours) || formData.numberOfGuidedTours < 0)) errors.numberOfGuidedTours = 'Nhập số hợp lệ';
        if (formData.cccd && !/^\d{9,12}$/.test(formData.cccd)) errors.cccd = 'CCCD không hợp lệ (9-12 chữ số)';
        if (formData.guideCertificate && !/^https?:\/\/.+/.test(formData.guideCertificate) && !formData.guideCertificate.includes('cloudinary.com')) errors.guideCertificate = 'URL chứng chỉ không hợp lệ';
        if (formData.healthCertificate && !/^https?:\/\/.+/.test(formData.healthCertificate) && !formData.healthCertificate.includes('cloudinary.com')) errors.healthCertificate = 'URL chứng chỉ không hợp lệ';
        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setIsSubmitting(true);
        console.log('Dữ liệu biểu mẫu:', formData);

        try {
            const response = await fetch('https://tradivabe.felixtien.dev/api/Auth/guideRegister', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Đăng ký thành công:', result);
                alert('Đăng ký thành công! Vui lòng kiểm tra email để nhận hướng dẫn xác minh.');
                setFormData({
                    name: '',
                    username: '',
                    email: '',
                    password: '',
                    phone: '',
                    address: '',
                    avatar: '',
                    major: '',
                    language: '',
                    yearExperience: '',
                    numberOfGuidedTours: '',
                    cccd: '',
                    guideCertificate: '',
                    healthCertificate: ''
                });
                setErrors({});
            } else {
                const errorData = await response.json();
                console.error('Đăng ký thất bại:', errorData);

                if (errorData.message) {
                    alert(`Đăng ký thất bại: ${errorData.message}`);
                } else if (errorData.errors) {
                    const apiErrors = {};
                    Object.keys(errorData.errors).forEach(key => {
                        apiErrors[key.toLowerCase()] = errorData.errors[key][0];
                    });
                    setErrors(apiErrors);
                } else {
                    alert('Đăng ký thất bại. Vui lòng kiểm tra thông tin và thử lại.');
                }
            }
        } catch (error) {
            console.error('Lỗi mạng:', error);
            alert('Lỗi mạng xảy ra. Vui lòng kiểm tra kết nối và thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const fieldGroups = [
        {
            title: "Thông tin cá nhân",
            icon: <User className="w-5 h-5" />,
            fields: [
                { name: 'name', label: 'Họ và tên', type: 'text', placeholder: 'Họ và tên của bạn', required: true, icon: <User className="w-4 h-4" /> },
                { name: 'username', label: 'Tên người dùng', type: 'text', placeholder: 'Tên người dùng của bạn', required: true, icon: <User className="w-4 h-4" /> },
                { name: 'email', label: 'Email', type: 'email', placeholder: 'email.cua.ban@example.com', required: true, icon: <Mail className="w-4 h-4" /> },
                { name: 'password', label: 'Mật khẩu', type: 'password', placeholder: 'Tối thiểu 8 ký tự', required: true, icon: <Lock className="w-4 h-4" /> },
                { name: 'phone', label: 'Số điện thoại', type: 'tel', placeholder: 'VD: +1234567890', icon: <Phone className="w-4 h-4" /> },
                { name: 'address', label: 'Địa chỉ', type: 'text', placeholder: 'Địa chỉ của bạn', icon: <MapPin className="w-4 h-4" /> },
                { name: 'avatar', label: 'Ảnh đại diện', type: 'file', placeholder: 'Tải lên ảnh của bạn', icon: <Camera className="w-4 h-4" />, accept: 'image/*', isFile: true }
            ]
        },
        {
            title: "Thông tin chuyên môn",
            icon: <GraduationCap className="w-5 h-5" />,
            fields: [
                { name: 'major', label: 'Chuyên ngành', type: 'text', placeholder: 'Chuyên ngành hoặc chuyên môn của bạn', icon: <GraduationCap className="w-4 h-4" /> },
                { name: 'language', label: 'Ngôn ngữ', type: 'text', placeholder: 'VD: Tiếng Anh, Tiếng Việt', icon: <Globe className="w-4 h-4" /> },
                { name: 'yearExperience', label: 'Số năm kinh nghiệm', type: 'number', placeholder: 'Số năm', min: 0, icon: <Award className="w-4 h-4" /> },
                { name: 'numberOfGuidedTours', label: 'Số tour đã hướng dẫn', type: 'number', placeholder: 'Số tour đã thực hiện', min: 0, icon: <Award className="w-4 h-4" /> }
            ]
        },
        {
            title: "Chứng chỉ & Tài liệu",
            icon: <FileText className="w-5 h-5" />,
            fields: [
                { name: 'cccd', label: 'CCCD (Số CMND/CCCD)', type: 'text', placeholder: '9-12 chữ số', icon: <Shield className="w-4 h-4" /> },
                { name: 'guideCertificate', label: 'Chứng chỉ hướng dẫn viên', type: 'file', placeholder: 'Tải lên chứng chỉ', icon: <FileText className="w-4 h-4" />, accept: 'image/*,.pdf', isFile: true },
                { name: 'healthCertificate', label: 'Chứng chỉ sức khỏe', type: 'file', placeholder: 'Tải lên chứng chỉ', icon: <FileText className="w-4 h-4" />, accept: 'image/*,.pdf', isFile: true }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 mt-5">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Tham gia Cộng đồng Hướng dẫn viên Du lịch</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Chia sẻ niềm đam mê du lịch và văn hóa với du khách từ khắp nơi trên thế giới.
                        Đăng ký ngay hôm nay để trở thành hướng dẫn viên được chứng nhận.
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mt-5">
                    <div className="p-8 space-y-8">
                        {fieldGroups.map((group, groupIndex) => (
                            <div key={group.title} className="space-y-6">
                                {/* Group Header */}
                                <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                                        {React.cloneElement(group.icon, { className: "w-5 h-5 text-white" })}
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900">{group.title}</h2>
                                </div>

                                {/* Fields Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {group.fields.map((field) => (
                                        <div key={field.name} className={field.name === 'address' || field.name === 'avatar' || field.name === 'guideCertificate' || field.name === 'healthCertificate' ? 'md:col-span-2' : ''}>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {field.label}
                                                {field.required && <span className="text-red-500 ml-1">*</span>}
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                    {field.icon}
                                                </div>
                                                {field.isFile ? (
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-center w-full">
                                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-colors">
                                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                    {uploadingFiles[field.name] ? (
                                                                        <div className="flex items-center space-x-2">
                                                                            <svg className="animate-spin h-5 w-5 text-blue-500" viewBox="0 0 24 24">
                                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                                                                            </svg>
                                                                            <span className="text-sm text-gray-500">Đang tải lên...</span>
                                                                        </div>
                                                                    ) : (
                                                                        <>
                                                                            <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                                                            <p className="mb-2 text-sm text-gray-500">
                                                                                <span className="font-semibold">Nhấn để tải lên</span> hoặc kéo và thả
                                                                            </p>
                                                                            <p className="text-xs text-gray-500">
                                                                                {field.name === 'avatar' ? 'PNG, JPG, GIF (TỐI ĐA 10MB)' : 'PNG, JPG, PDF (TỐI ĐA 10MB)'}
                                                                            </p>
                                                                        </>
                                                                    )}
                                                                </div>
                                                                <input
                                                                    type="file"
                                                                    className="hidden"
                                                                    accept={field.accept}
                                                                    onChange={(e) => handleFileUpload(e, field.name)}
                                                                    disabled={uploadingFiles[field.name]}
                                                                />
                                                            </label>
                                                        </div>
                                                        {formData[field.name] && (
                                                            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                                                <div className="flex items-center space-x-2">
                                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                                    <span className="text-sm text-green-700">Tệp đã tải lên thành công</span>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setFormData(prev => ({ ...prev, [field.name]: '' }))}
                                                                    className="text-gray-400 hover:text-gray-600"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <>
                                                        <input
                                                            type={field.type}
                                                            name={field.name}
                                                            value={formData[field.name]}
                                                            onChange={handleChange}
                                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors[field.name]
                                                                ? 'border-red-300 bg-red-50'
                                                                : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'
                                                                }`}
                                                            placeholder={field.placeholder}
                                                            required={field.required}
                                                            min={field.min}
                                                        />
                                                        {formData[field.name] && !errors[field.name] && (
                                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                            {errors[field.name] && (
                                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                                    <span className="w-4 h-4 mr-1">⚠️</span>
                                                    {errors[field.name]}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Submit Button */}
                        <div className="pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                onClick={handleSubmit}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:scale-100 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                                        </svg>
                                        Đang xử lý đăng ký...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center">
                                        <User className="w-5 h-5 mr-2" />
                                        Đăng ký làm Hướng dẫn viên
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Footer */}
                        <div className="text-center text-sm text-gray-500 pt-4">
                            Bằng cách đăng ký, bạn đồng ý với Điều khoản Dịch vụ và Chính sách Bảo mật của chúng tôi
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterGuide;