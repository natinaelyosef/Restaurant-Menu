import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import useTranslation from '@/i18n/useTranslation';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const FormInput = memo(function FormInput({ label, ...props }) {
    return (
        <div>
            {label && <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>}
            <input
                {...props}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c8102e]/20 focus:border-[#c8102e] transition-all shadow-sm"
            />
        </div>
    );
});

const FormTextarea = memo(function FormTextarea({ label, ...props }) {
    return (
        <div>
            {label && <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>}
            <textarea
                {...props}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c8102e]/20 focus:border-[#c8102e] transition-all shadow-sm resize-none"
            />
        </div>
    );
});

function useDebouncedValue(value, delay = 250) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => window.clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

function getAboutImageSrc(sections, aboutImagePreview) {
    if (aboutImagePreview) return aboutImagePreview;
    const img = sections?.about?.image || '';
    if (!img) return null;
    if (img.startsWith('http') || img.startsWith('/')) return img;
    return `/storage/${img}`;
}

const PreviewPanel = memo(function PreviewPanel({
    formData,
    imagePreview,
    aboutImagePreview,
    onEditSection,
}) {
    const aboutPreviewSrc = getAboutImageSrc(formData.sections, aboutImagePreview);

    return (
        <div className="lg:sticky lg:top-24 lg:self-start h-fit">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-6 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                            </span>
                            Live Preview
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">Updates after typing pauses</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-2xl border border-gray-100 overflow-hidden">
                        {formData.logo_type === 'text' ? (
                            <span>{formData.logo_text}</span>
                        ) : (
                            <img
                                src={imagePreview || formData.logo_url || (typeof formData.logo === 'string' && formData.logo.startsWith('/') ? formData.logo : `/storage/${formData.logo}`)}
                                alt="logo"
                                className="w-8 h-8 object-contain"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        )}
                    </div>
                    <div>
                        <div className="font-bold text-gray-900 truncate">{formData.name || 'Restaurant Name'}</div>
                        <div className="text-xs text-gray-500">Brand Identity</div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-[10px] font-bold text-[#c8102e] uppercase tracking-widest">Specials</div>
                            <div className="font-bold text-gray-900 text-sm">{formData.sections?.specials?.heading || "Today's Specials"}</div>
                        </div>
                        <button type="button" onClick={() => onEditSection('specials')} className="text-xs font-semibold text-[#c8102e] hover:underline">Edit</button>
                    </div>
                    <div className="space-y-2">
                        {(formData.sections?.specials?.items || []).slice(0, 2).map((it, i) => (
                            <div key={i} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                                <div className="text-xl">{it.icon}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-xs text-gray-900 truncate">{it.title}</div>
                                    <div className="text-[10px] text-gray-500 truncate">{it.desc}</div>
                                </div>
                                <div className="text-xs font-bold text-[#d4a017]">{it.price}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-[10px] font-bold text-[#c8102e] uppercase tracking-widest">About</div>
                            <div className="font-bold text-gray-900 text-sm">{formData.sections?.about?.heading || 'Our Story'}</div>
                        </div>
                        <button type="button" onClick={() => onEditSection('about')} className="text-xs font-semibold text-[#c8102e] hover:underline">Edit</button>
                    </div>
                    <div className="flex gap-3 items-center p-2 bg-gray-50 rounded-lg">
                        {aboutPreviewSrc ? (
                            <img src={aboutPreviewSrc} alt="about" className="h-14 w-14 object-cover rounded-lg shadow-sm" />
                        ) : (
                            <div className="h-14 w-14 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">Img</div>
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="font-semibold text-xs text-gray-900 truncate">{formData.sections?.about?.title}</div>
                            <div className="text-[10px] text-gray-500 line-clamp-2">{formData.sections?.about?.text}</div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-[10px] font-bold text-[#c8102e] uppercase tracking-widest">Reviews</div>
                            <div className="font-bold text-gray-900 text-sm">{formData.sections?.testimonials?.heading || 'Testimonials'}</div>
                        </div>
                        <button type="button" onClick={() => onEditSection('testimonials')} className="text-xs font-semibold text-[#c8102e] hover:underline">Edit</button>
                    </div>
                    <div className="space-y-2">
                        {(formData.sections?.testimonials?.items || []).slice(0, 2).map((t, i) => (
                            <div key={i} className="p-2 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <div className="font-semibold text-xs text-gray-900">{t.name}</div>
                                    <div className="text-[10px] text-[#d4a017]">{t.stars}</div>
                                </div>
                                <div className="text-[10px] text-gray-500 line-clamp-1 italic">"{t.text}"</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-[10px] font-bold text-[#c8102e] uppercase tracking-widest">Contact</div>
                            <div className="font-bold text-gray-900 text-sm">{formData.sections?.reservation?.titleLarge || 'Book Your Table'}</div>
                        </div>
                        <button type="button" onClick={() => onEditSection('reservation')} className="text-xs font-semibold text-[#c8102e] hover:underline">Edit</button>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg text-[10px] text-gray-600 line-clamp-2">
                        {formData.sections?.reservation?.text}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default function RestaurantSettings({ settings }) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('specials');
    const [formData, setFormData] = useState({
        name: settings.name || 'Dola Grill',
        logo: settings.logo || '🍔',
        logo_type: settings.logo && (settings.logo.startsWith('http') || settings.logo.startsWith('/storage')) ? 'url' : 
                   (settings.logo && settings.logo.length === 1) ? 'text' : 'upload',
        logo_url: settings.logo && (settings.logo.startsWith('http') || settings.logo.startsWith('/storage')) ? settings.logo : '',
        logo_text: settings.logo && settings.logo.length === 1 ? settings.logo : '',
        sections: settings.sections || {},
        background_type: settings.background_type || 'image',
        background_image: settings.background_image || '',
        background_image_url: settings.background_image && (settings.background_image.startsWith('http') || settings.background_image.startsWith('/')) ? settings.background_image : '',
        background_video: settings.background_video || '',
    });
    const [imagePreview, setImagePreview] = useState(null);
    const initialAboutImageSource = (settings?.sections?.about?.image)
        ? ((settings.sections.about.image.startsWith('http') || settings.sections.about.image.startsWith('/')) ? 'url' : 'upload')
        : 'url';

    const initialAboutPreview = (() => {
        const img = settings?.sections?.about?.image || '';
        if (!img) return null;
        if (img.startsWith('http') || img.startsWith('/')) return img;
        return `/storage/${img}`;
    })();

    const [aboutImageSource, setAboutImageSource] = useState(initialAboutImageSource);
    const [aboutImageFile, setAboutImageFile] = useState(null);
    const [aboutImagePreview, setAboutImagePreview] = useState(initialAboutPreview);
    const [backgroundImageFile, setBackgroundImageFile] = useState(null);
    const [backgroundImagePreview, setBackgroundImagePreview] = useState(null);
    const [backgroundVideoFile, setBackgroundVideoFile] = useState(null);
    const [backgroundVideoSource, setBackgroundVideoSource] = useState(
        settings.background_video && (settings.background_video.startsWith('http') || settings.background_video.startsWith('/')) ? 'url' : 'upload'
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const previewFormData = useDebouncedValue(formData, 300);
    const aboutPreviewSrc = useMemo(
        () => getAboutImageSrc(formData.sections, aboutImagePreview),
        [formData.sections, aboutImagePreview]
    );

    const handleLogoChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, logo: file, logo_type: 'upload' }));
            setImagePreview(URL.createObjectURL(file));
        }
    }, []);

    const handleSectionChange = useCallback((section, field, value, index = null) => {
        setFormData(prev => {
            const newSections = { ...prev.sections };
            
            if (index !== null && Array.isArray(newSections[section])) {
                newSections[section] = [...newSections[section]];
                newSections[section][index] = { ...newSections[section][index], [field]: value };
            } else if (index !== null && newSections[section]?.items) {
                newSections[section].items = [...newSections[section].items];
                newSections[section].items[index] = { ...newSections[section].items[index], [field]: value };
            } else {
                newSections[section] = { ...newSections[section], [field]: value };
            }
            
            return { ...prev, sections: newSections };
        });
    }, []);

    const handleBackgroundFileChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            setBackgroundImageFile(file);
            setBackgroundImagePreview(URL.createObjectURL(file));
            setFormData(prev => ({ ...prev, background_type: 'image', background_image_url: '' }));
        }
    }, []);

    const handleVideoFileChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            setBackgroundVideoFile(file);
            setBackgroundVideoSource('upload');
            setFormData(prev => ({ ...prev, background_type: 'video', background_video: '' }));
        }
    }, []);

    const handleAboutFileChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            setAboutImageFile(file);
            setAboutImagePreview(URL.createObjectURL(file));
            setFormData(prev => {
                const newSections = { ...prev.sections };
                newSections.about = { ...newSections.about, image: '' };
                return { ...prev, sections: newSections };
            });
        }
    }, []);

    const addSectionItem = useCallback((section) => {
        setFormData(prev => {
            const newSections = { ...prev.sections };
            if (!newSections[section]) newSections[section] = {};

            if (!Array.isArray(newSections[section].items)) newSections[section].items = [];

            if (section === 'specials') {
                newSections[section].items.push({ icon: '🍔', title: '', desc: '', price: '', oldPrice: '' });
            } else if (section === 'testimonials') {
                newSections[section].items.push({ avatar: '', stars: '⭐⭐⭐⭐⭐', text: '', name: '', role: '' });
            }

            return { ...prev, sections: newSections };
        });
    }, []);

    const removeSectionItem = useCallback((section, index) => {
        setFormData(prev => {
            const newSections = { ...prev.sections };
            if (!newSections[section]) return prev;
            const items = Array.isArray(newSections[section].items) ? [...newSections[section].items] : [];
            items.splice(index, 1);
            newSections[section].items = items;
            return { ...prev, sections: newSections };
        });
    }, []);

    const handleEditSection = useCallback((section) => {
        setActiveTab(section);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('logo_type', formData.logo_type);
        
        if (formData.logo_type === 'upload' && formData.logo instanceof File) {
            data.append('logo', formData.logo);
        } else if (formData.logo_type === 'url') {
            data.append('logo_url', formData.logo_url);
        } else if (formData.logo_type === 'text') {
            data.append('logo_text', formData.logo_text);
        }

        data.append('sections', JSON.stringify(formData.sections));

        if (aboutImageSource === 'upload' && aboutImageFile instanceof File) {
            data.append('about_image', aboutImageFile);
        }

        data.append('background_type', formData.background_type);
        if (formData.background_type === 'image') {
            if (backgroundImageFile instanceof File) {
                data.append('background_image', backgroundImageFile);
            } else if (formData.background_image_url) {
                data.append('background_image_url', formData.background_image_url);
            }
        } else if (formData.background_type === 'video') {
            if (backgroundVideoFile instanceof File) {
                data.append('background_video_file', backgroundVideoFile);
            } else if (formData.background_video) {
                data.append('background_video', formData.background_video);
            }
        }

        router.post('/super/restaurant-settings', data, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
                alert(t('settingsSaved'));
            },
            onError: () => {
                setIsSubmitting(false);
            },
        });
    };

    const tabs = [
        { id: 'specials', label: t('specials'), icon: '🔥' },
        { id: 'about', label: t('aboutUs'), icon: '📖' },
        { id: 'testimonials', label: t('reviews'), icon: '⭐' },
        { id: 'reservation', label: t('contact'), icon: '📞' },
    ];

    return (
        <AdminLayout title="Restaurant Settings" active="restaurant-settings" fullWidth>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t('restaurantSettings')}</h1>
                    <p className="text-gray-500 mt-1">{t('customizeHomepage')}</p>
                </div>
            </div>

            <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 xl:grid-cols-[1.8fr_1fr] gap-8">
                        <div className="space-y-8">
                            {/* General Settings */}
                            <div id="general-settings" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-gray-100">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                            <span className="w-8 h-8 bg-[#c8102e]/10 text-[#c8102e] rounded-lg flex items-center justify-center text-lg">⚙️</span>
                                            {t('generalSettings')}
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-1">{t('updateBranding')}</p>
                                    </div>
                                    <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700 border border-green-100">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                        {t('liveSync')}
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput 
                                        label={t('restaurantName')} 
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="e.g. Dola Grill"
                                        required
                                    />

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('logoType')}</label>
                                        <div className="flex gap-2 mb-3">
                                            {['text', 'upload', 'url'].map(type => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, logo_type: type }))}
                                                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all border ${
                                                        formData.logo_type === type 
                                                            ? 'bg-[#c8102e] text-white border-[#c8102e] shadow-sm' 
                                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {type === 'text' ? t('emoji') : type === 'upload' ? t('upload') : t('url')}
                                                </button>
                                            ))}
                                        </div>

                                        {formData.logo_type === 'text' && (
                                            <input
                                                type="text"
                                                value={formData.logo_text}
                                                onChange={(e) => setFormData(prev => ({ ...prev, logo_text: e.target.value, logo: e.target.value }))}
                                                placeholder="🍔"
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e]/20 focus:border-[#c8102e] transition-all shadow-sm"
                                            />
                                        )}

                                        {formData.logo_type === 'upload' && (
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleLogoChange}
                                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#c8102e]/10 file:text-[#c8102e] hover:file:bg-[#c8102e]/20 file:cursor-pointer cursor-pointer border border-gray-200 rounded-xl"
                                                />
                                            </div>
                                        )}

                                        {formData.logo_type === 'url' && (
                                            <input
                                                type="url"
                                                value={formData.logo_url}
                                                onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value, logo: e.target.value }))}
                                                placeholder="https://example.com/logo.png"
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e]/20 focus:border-[#c8102e] transition-all shadow-sm"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Homepage Background Settings */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                                <div className="mb-6 pb-6 border-b border-gray-100">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <span className="w-8 h-8 bg-[#c8102e]/10 text-[#c8102e] rounded-lg flex items-center justify-center text-lg">🖼️</span>
                                        Homepage Background
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">Set the hero section background to an image or video</p>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">Background Type</label>
                                    <div className="flex gap-2">
                                        {[
                                            { value: 'image', label: 'Image' },
                                            { value: 'video', label: 'Video' },
                                            { value: 'none', label: 'None' },
                                        ].map(type => (
                                            <button
                                                key={type.value}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, background_type: type.value }))}
                                                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all border ${
                                                    formData.background_type === type.value
                                                        ? 'bg-[#c8102e] text-white border-[#c8102e] shadow-sm'
                                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                                }`}
                                            >
                                                {type.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {formData.background_type === 'image' && (
                                    <div className="space-y-4">
                                        <div className="flex gap-4 mb-2">
                                            {['upload', 'url'].map(source => (
                                                <button
                                                    key={source}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData(prev => ({ ...prev, background_image_url: source === 'url' ? prev.background_image_url || '' : '' }));
                                                        setBackgroundImageFile(null);
                                                        setBackgroundImagePreview(null);
                                                    }}
                                                    className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all border ${
                                                        (source === 'upload' && backgroundImageFile) || (source === 'url' && !backgroundImageFile)
                                                            ? 'bg-[#c8102e] text-white border-[#c8102e] shadow-sm'
                                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {source === 'upload' ? '📁 Upload File' : '🔗 Use URL'}
                                                </button>
                                            ))}
                                        </div>

                                        <div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleBackgroundFileChange}
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#c8102e]/10 file:text-[#c8102e] hover:file:bg-[#c8102e]/20 file:cursor-pointer cursor-pointer border border-gray-200 rounded-xl"
                                            />
                                        </div>

                                        <div className={backgroundImageFile ? 'hidden' : ''}>
                                            <input
                                                type="url"
                                                value={formData.background_image_url}
                                                onChange={(e) => setFormData(prev => ({ ...prev, background_image_url: e.target.value }))}
                                                placeholder="https://images.unsplash.com/photo-..."
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e]/20 focus:border-[#c8102e] transition-all shadow-sm"
                                            />
                                        </div>

                                        {(backgroundImagePreview || formData.background_image_url) && (
                                            <div className="mt-2">
                                                <img
                                                    src={backgroundImagePreview || formData.background_image_url}
                                                    alt="Background preview"
                                                    className="h-32 w-full object-cover rounded-xl shadow-sm border border-gray-100"
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {formData.background_type === 'video' && (
                                    <div className="space-y-4">
                                        <div className="flex gap-4 mb-2">
                                            {['upload', 'url'].map(source => (
                                                <button
                                                    key={source}
                                                    type="button"
                                                    onClick={() => {
                                                        setBackgroundVideoSource(source);
                                                        if (source === 'url') {
                                                            setBackgroundVideoFile(null);
                                                        } else {
                                                            setFormData(prev => ({ ...prev, background_video: '' }));
                                                        }
                                                    }}
                                                    className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all border ${
                                                        backgroundVideoSource === source
                                                            ? 'bg-[#c8102e] text-white border-[#c8102e] shadow-sm'
                                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {source === 'upload' ? '📁 Upload File' : '🔗 Use URL'}
                                                </button>
                                            ))}
                                        </div>

                                        {backgroundVideoSource === 'upload' && (
                                            <div>
                                                <input
                                                    type="file"
                                                    accept="video/*"
                                                    onChange={handleVideoFileChange}
                                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#c8102e]/10 file:text-[#c8102e] hover:file:bg-[#c8102e]/20 file:cursor-pointer cursor-pointer border border-gray-200 rounded-xl"
                                                />
                                                {backgroundVideoFile && (
                                                    <p className="text-xs text-green-600 mt-2">✓ {backgroundVideoFile.name} selected</p>
                                                )}
                                            </div>
                                        )}

                                        {backgroundVideoSource === 'url' && (
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Video URL</label>
                                                <input
                                                    type="url"
                                                    value={formData.background_video}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, background_video: e.target.value }))}
                                                    placeholder="https://example.com/background.mp4"
                                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c8102e]/20 focus:border-[#c8102e] transition-all shadow-sm"
                                                />
                                                <p className="text-xs text-gray-400 mt-2">Enter a direct URL to an MP4 video file</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Tabs Section */}
                            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                                <div className="border-b border-gray-100 px-4 py-4 bg-gray-50/50 overflow-x-auto">
                                    <nav className="flex gap-2 min-w-max">
                                        {tabs.map(tab => (
                                            <button
                                                key={tab.id}
                                                type="button"
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                                    activeTab === tab.id
                                                        ? 'bg-[#c8102e] text-white shadow-md shadow-[#c8102e]/20'
                                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                            >
                                                <span>{tab.icon}</span>
                                                {tab.label}
                                            </button>
                                        ))}
                                    </nav>
                                </div>

                                <div className="p-6 md:p-8">
                                    {/* Specials Section */}
                                    {activeTab === 'specials' && (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <FormInput label="Section Heading" value={formData.sections.specials?.heading || ''} onChange={(e) => handleSectionChange('specials', 'heading', e.target.value)} placeholder="e.g. Today's Specials" />
                                                <FormInput label="Section Title" value={formData.sections.specials?.title || ''} onChange={(e) => handleSectionChange('specials', 'title', e.target.value)} placeholder="e.g. Chef's Recommendations" />
                                            </div>
                                            <FormTextarea label="Description" value={formData.sections.specials?.description || ''} onChange={(e) => handleSectionChange('specials', 'description', e.target.value)} rows="2" placeholder="Brief description of the specials..." />

                                            <div className="pt-6 border-t border-gray-100">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="text-lg font-bold text-gray-900">Special Items</h3>
                                                    <button type="button" onClick={() => addSectionItem('specials')} className="text-sm font-semibold text-[#c8102e] hover:text-[#a00d24] flex items-center gap-1">
                                                        <span className="text-lg">+</span> Add Item
                                                    </button>
                                                </div>
                                                
                                                <div className="space-y-4">
                                                    {formData.sections.specials?.items?.map((item, index) => (
                                                        <div key={index} className="bg-gray-50/50 border border-gray-100 rounded-xl p-5 space-y-4 relative group hover:border-gray-200 transition-colors">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Item {index + 1}</span>
                                                                <button type="button" onClick={() => removeSectionItem('specials', index)} className="text-red-500 hover:text-red-700 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    Remove
                                                                </button>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                <FormInput label="Icon (Emoji)" value={item.icon || ''} onChange={(e) => handleSectionChange('specials', 'icon', e.target.value, index)} placeholder="🍔" />
                                                                <FormInput label="Title" value={item.title || ''} onChange={(e) => handleSectionChange('specials', 'title', e.target.value, index)} placeholder="Dola Classic" />
                                                                <div className="grid grid-cols-2 gap-3">
                                                                    <FormInput label="Price" value={item.price || ''} onChange={(e) => handleSectionChange('specials', 'price', e.target.value, index)} placeholder="$14.99" />
                                                                    <FormInput label="Old Price" value={item.oldPrice || ''} onChange={(e) => handleSectionChange('specials', 'oldPrice', e.target.value, index)} placeholder="$19.99" />
                                                                </div>
                                                            </div>
                                                            <FormTextarea label="Description" value={item.desc || ''} onChange={(e) => handleSectionChange('specials', 'desc', e.target.value, index)} rows="2" placeholder="Describe the item..." />
                                                        </div>
                                                    ))}
                                                    
                                                    <button type="button" onClick={() => addSectionItem('specials')} className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-[#c8102e] hover:text-[#c8102e] transition-colors font-semibold flex items-center justify-center gap-2">
                                                        <span className="text-xl">+</span> Add New Special
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* About Section */}
                                    {activeTab === 'about' && (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <FormInput label="Heading" value={formData.sections.about?.heading || ''} onChange={(e) => handleSectionChange('about', 'heading', e.target.value)} placeholder="e.g. Our Story" />
                                                <FormInput label="Years of Experience" value={formData.sections.about?.years || ''} onChange={(e) => handleSectionChange('about', 'years', e.target.value)} placeholder="e.g. 15+" />
                                            </div>
                                            <FormInput label="Main Title" value={formData.sections.about?.title || ''} onChange={(e) => handleSectionChange('about', 'title', e.target.value)} placeholder="e.g. Crafted With Love Since 2009" />
                                            <FormTextarea label="Story Text" value={formData.sections.about?.text || ''} onChange={(e) => handleSectionChange('about', 'text', e.target.value)} rows="4" placeholder="Tell your restaurant's story..." />
                                            
                                            <div className="pt-6 border-t border-gray-100">
                                                <label className="block text-sm font-semibold text-gray-700 mb-3">About Image</label>
                                                <div className="flex gap-4 mb-4">
                                                    {['url', 'upload'].map(type => (
                                                        <button
                                                            key={type}
                                                            type="button"
                                                            onClick={() => setAboutImageSource(type)}
                                                            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all border ${
                                                                aboutImageSource === type 
                                                                    ? 'bg-[#c8102e] text-white border-[#c8102e] shadow-sm' 
                                                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            {type === 'url' ? '🔗 Use URL' : '📁 Upload File'}
                                                        </button>
                                                    ))}
                                                </div>

                                                {aboutImageSource === 'url' && (
                                                    <FormInput 
                                                        type="url"
                                                        value={formData.sections.about?.image || ''}
                                                        onChange={(e) => handleSectionChange('about', 'image', e.target.value)}
                                                        placeholder="https://images.unsplash.com/..."
                                                    />
                                                )}

                                                {aboutImageSource === 'upload' && (
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleAboutFileChange}
                                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#c8102e]/10 file:text-[#c8102e] hover:file:bg-[#c8102e]/20 file:cursor-pointer cursor-pointer border border-gray-200 rounded-xl"
                                                    />
                                                )}

                                                {aboutPreviewSrc && (
                                                    <div className="mt-4 relative group inline-block">
                                                        <img src={aboutPreviewSrc} alt="About preview" className="h-40 w-auto rounded-xl shadow-sm border border-gray-100" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Testimonials */}
                                    {activeTab === 'testimonials' && (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <FormInput label="Section Heading" value={formData.sections.testimonials?.heading || ''} onChange={(e) => handleSectionChange('testimonials', 'heading', e.target.value)} placeholder="e.g. Testimonials" />
                                                <FormInput label="Section Title" value={formData.sections.testimonials?.title || ''} onChange={(e) => handleSectionChange('testimonials', 'title', e.target.value)} placeholder="e.g. What Our Guests Say" />
                                            </div>

                                            <div className="pt-6 border-t border-gray-100">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="text-lg font-bold text-gray-900">Customer Reviews</h3>
                                                    <button type="button" onClick={() => addSectionItem('testimonials')} className="text-sm font-semibold text-[#c8102e] hover:text-[#a00d24] flex items-center gap-1">
                                                        <span className="text-lg">+</span> Add Review
                                                    </button>
                                                </div>
                                                
                                                <div className="space-y-4">
                                                    {formData.sections.testimonials?.items?.map((item, index) => (
                                                        <div key={index} className="bg-gray-50/50 border border-gray-100 rounded-xl p-5 space-y-4 relative group hover:border-gray-200 transition-colors">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Review {index + 1}</span>
                                                                <button type="button" onClick={() => removeSectionItem('testimonials', index)} className="text-red-500 hover:text-red-700 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    Remove
                                                                </button>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                <FormInput label="Avatar (Initials)" value={item.avatar || ''} onChange={(e) => handleSectionChange('testimonials', 'avatar', e.target.value, index)} placeholder="JD" />
                                                                <FormInput label="Stars" value={item.stars || ''} onChange={(e) => handleSectionChange('testimonials', 'stars', e.target.value, index)} placeholder="⭐⭐⭐⭐⭐" />
                                                                <FormInput label="Role" value={item.role || ''} onChange={(e) => handleSectionChange('testimonials', 'role', e.target.value, index)} placeholder="Food Blogger" />
                                                            </div>
                                                            <FormInput label="Customer Name" value={item.name || ''} onChange={(e) => handleSectionChange('testimonials', 'name', e.target.value, index)} placeholder="James Davidson" />
                                                            <FormTextarea label="Review Text" value={item.text || ''} onChange={(e) => handleSectionChange('testimonials', 'text', e.target.value, index)} rows="3" placeholder="The best burger I've ever had..." />
                                                        </div>
                                                    ))}

                                                    <button type="button" onClick={() => addSectionItem('testimonials')} className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-[#c8102e] hover:text-[#c8102e] transition-colors font-semibold flex items-center justify-center gap-2">
                                                        <span className="text-xl">+</span> Add New Review
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Reservation Info */}
                                    {activeTab === 'reservation' && (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <FormInput label="Small Title" value={formData.sections.reservation?.titleSmall || ''} onChange={(e) => handleSectionChange('reservation', 'titleSmall', e.target.value)} placeholder="e.g. Reservation" />
                                                <FormInput label="Large Title" value={formData.sections.reservation?.titleLarge || ''} onChange={(e) => handleSectionChange('reservation', 'titleLarge', e.target.value)} placeholder="e.g. Book Your Table Today" />
                                            </div>
                                            <FormTextarea label="Description Text" value={formData.sections.reservation?.text || ''} onChange={(e) => handleSectionChange('reservation', 'text', e.target.value)} rows="3" placeholder="Reserve your spot at Dola Grill House..." />
                                            
                                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
                                                💡 <strong>Note:</strong> Contact details (Location, Hours, Phone, Email) are currently managed in the code. To make them editable here, we can add them as an array in the next update!
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <PreviewPanel
                            formData={previewFormData}
                            imagePreview={imagePreview}
                            aboutImagePreview={aboutImagePreview}
                            onEditSection={handleEditSection}
                        />
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c8102e] px-8 py-3.5 text-white font-bold shadow-lg shadow-[#c8102e]/20 transition-all hover:bg-[#a00d24] hover:shadow-xl hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:transform-none"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {t('saving')}
                                </>
                            ) : (
                                <>💾 {t('saveAllSettings')}</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
