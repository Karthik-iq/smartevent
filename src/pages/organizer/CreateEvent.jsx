import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

export function CreateEvent() {
  const { addEvent } = useAppContext();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
    ticketPrice: '',
    totalTickets: '',
    image: '',
    category: 'Technology'
  });
  
  const [errors, setErrors] = useState({});

  const categories = ['Technology', 'Music', 'Business', 'Sports', 'Education', 'Entertainment'];

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Event name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    
    if (formData.ticketPrice === '') {
      newErrors.ticketPrice = 'Ticket price is required';
    } else if (Number(formData.ticketPrice) < 0) {
      newErrors.ticketPrice = 'Ticket price cannot be negative';
    }
    
    if (!formData.totalTickets) {
      newErrors.totalTickets = 'Total tickets is required';
    } else if (Number(formData.totalTickets) <= 0) {
      newErrors.totalTickets = 'Total tickets must be greater than zero';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      addEvent({
        ...formData,
        ticketPrice: Number(formData.ticketPrice),
        totalTickets: Number(formData.totalTickets),
      });
      addToast('Event created successfully!');
      navigate('/organizer/events');
    } else {
      addToast('Please correct the highlighted fields.', 'error');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // clear error for that field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Create New Event</h1>
      </div>

      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="Event Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="E.g., Tech Summit 2026"
              />
            </div>
            
            <div className="sm:col-span-2">
              <Input
                label="Description"
                name="description"
                type="textarea"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                error={errors.description}
                placeholder="Describe your event in detail..."
              />
            </div>

            <div>
              <Input
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                error={errors.date}
              />
            </div>

            <div>
              <Input
                label="Time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                error={errors.time}
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                error={errors.location}
                placeholder="E.g., Grand Hotel, Mumbai"
              />
            </div>

            <div>
              <Input
                label="Ticket Price (₹)"
                name="ticketPrice"
                type="number"
                min="0"
                value={formData.ticketPrice}
                onChange={handleChange}
                error={errors.ticketPrice}
                placeholder="E.g., 500 (0 for free)"
              />
            </div>

            <div>
              <Input
                label="Total Tickets"
                name="totalTickets"
                type="number"
                min="1"
                value={formData.totalTickets}
                onChange={handleChange}
                error={errors.totalTickets}
                placeholder="E.g., 200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Event Image URL"
                name="image"
                value={formData.image}
                onChange={handleChange}
                error={errors.image}
                placeholder="https://images.unsplash.com/..."
              />
              {formData.image && !errors.image && (
                <div className="mt-4 rounded-xl overflow-hidden h-48 w-full max-w-sm border border-slate-200">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://placehold.co/600x400?text=Invalid+Image'} />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-slate-100">
            <Button type="button" variant="outline" className="mr-3" onClick={() => navigate('/organizer/events')}>
              Cancel
            </Button>
            <Button type="submit" icon={Save}>
              Create Event
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
