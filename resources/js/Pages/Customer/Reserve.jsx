import React, { useState, useEffect } from 'react';
import useTranslation from '@/i18n/useTranslation';
import { router } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';

export default function Reserve({ userName, userEmail, errors: propErrors }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: userName || '',
        email: userEmail || '',
        phone: '',
        reservation_date: '',
        reservation_time: '',
        guests: 1,
        special_requests: '',
    });

    const [availableTimes, setAvailableTimes] = useState([]);
    const [bookedTimes, setBookedTimes] = useState([]);
    const [loadingTimes, setLoadingTimes] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // Fetch available times when date changes
    useEffect(() => {
        if (!formData.reservation_date) {
            setAvailableTimes([]);
            setBookedTimes([]);
            return;
        }

        setLoadingTimes(true);
        fetch(`/customer/available-times?date=${formData.reservation_date}`, {
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        })
        .then((res) => res.json())
        .then((data) => {
            setAvailableTimes(data.available || []);
            setBookedTimes(data.booked || []);
            // Reset time if it's no longer available
            if (formData.reservation_time && data.booked?.includes(formData.reservation_time)) {
                setFormData((prev) => ({ ...prev, reservation_time: '' }));
            }
            setLoadingTimes(false);
        })
        .catch(() => setLoadingTimes(false));
    }, [formData.reservation_date]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors({});
        router.post('/customer/reserve', formData, {
            onError: (errors) => setFormErrors(errors),
        });
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <CustomerLayout title="Make a Reservation" active="reserve">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{t('makeReservation')}</h1>
                <p className="text-gray-600 mt-1">{t('bookTableVisit')}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Reservation Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('fullName')} *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                                        required
                                    />
                                    {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('emailAddress')} *</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                                        required
                                    />
                                    {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('phoneNumber')}</label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder={t('optional')}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('date')} *</label>
                                    <input
                                        type="date"
                                        value={formData.reservation_date}
                                        onChange={(e) => setFormData({ ...formData, reservation_date: e.target.value, reservation_time: '' })}
                                        min={today}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.reservation_date ? 'border-red-500' : 'border-gray-300'}`}
                                        required
                                    />
                                    {formErrors.reservation_date && <p className="text-red-500 text-xs mt-1">{formErrors.reservation_date}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('numberOfGuests')} *</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="50"
                                        value={formData.guests}
                                        onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) || 1 })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formErrors.guests ? 'border-red-500' : 'border-gray-300'}`}
                                        required
                                    />
                                    {formErrors.guests && <p className="text-red-500 text-xs mt-1">{formErrors.guests}</p>}
                                </div>
                            </div>

                            {/* Time Slots */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('selectTime')} *
                                    {loadingTimes && <span className="ml-2 text-blue-500 text-xs">({t('loadingAvailableTimes')})</span>}
                                </label>

                                {!formData.reservation_date ? (
                                    <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500 text-sm">
                                        {t('selectDateFirst')}
                                    </div>
                                ) : (
                                    <>
                                        {formErrors.reservation_time && <p className="text-red-500 text-xs mb-2">{formErrors.reservation_time}</p>}
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                            {availableTimes.length === 0 && !loadingTimes ? (
                                                <p className="col-span-full text-center text-gray-500 text-sm py-4">
                                                    {t('noTimeSlots')}
                                                </p>
                                            ) : (
                                                availableTimes.map((time) => (
                                                    <button
                                                        key={time}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, reservation_time: time })}
                                                        className={`px-3 py-2 text-sm rounded-lg border transition-all font-medium ${
                                                            formData.reservation_time === time
                                                                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                                                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                                                        }`}
                                                    >
                                                        {time}
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                        {bookedTimes.length > 0 && (
                                            <p className="text-xs text-gray-500 mt-2">
                                                ⚠️ {bookedTimes.length} time slot{bookedTimes.length > 1 ? 's' : ''} already booked for this date
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('specialRequests')}</label>
                                <textarea
                                    value={formData.special_requests}
                                    onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    rows="3"
                                    placeholder={t('specialRequestsPlaceholder')}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
                            >
                                {t('submitReservation')}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                        <h4 className="font-semibold text-blue-900 mb-2">{t('reservationInfo')}</h4>
                        <ul className="text-sm text-blue-700 space-y-2">
                            <li>{t('reservationInfo1')}</li>
                            <li>{t('reservationInfo2')}</li>
                            <li>{t('reservationInfo3')}</li>
                            <li>{t('reservationInfo4')}</li>
                        </ul>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                        <h4 className="font-semibold text-green-900 mb-2">{t('operatingHours')}</h4>
                        <ul className="text-sm text-green-700 space-y-1">
                            <li>{t('mondayFriday')}</li>
                            <li>{t('saturday')}</li>
                            <li>{t('sunday')}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
