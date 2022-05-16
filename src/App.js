import React, {useState, useEffect} from 'react';
import { Service } from './Service';

function App() {

  const [tenants, setTentants] = useState([]);
  const [tenantsWithFilters, setTentantsWithFilters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newTenant, setnewTenant] = useState({});


  useEffect(() => {
    const fetchData = async () => {
      const data = await Service.getTenants();
      setTentants(data);
      setTentantsWithFilters(data);
      setLoading(false);
    }
    fetchData();
  }, []);


  const resetFilters = () => {
    setTentantsWithFilters(tenants);
  }

  const filterByStatus = (paymentStatus) => {
    setTentantsWithFilters(tenants.filter((tenant)=>tenant.paymentStatus===paymentStatus));
  }

  const filterByLeaseEndDateMonthLessThan = (months) => {
    const monthsRemaining = months-1;
    setTentantsWithFilters(tenants.filter((tenant)=>monthDiffCalculator(tenant.leaseEndDate)===monthsRemaining));
  }

  const monthDiffCalculator = (leaseEndDate) => {
    let months;
    const currentDate = new Date();
    const comparedDate = new Date(leaseEndDate);
    months = (comparedDate.getFullYear() - currentDate.getFullYear()) * 12;
    months -= currentDate.getMonth();
    months += comparedDate.getMonth();
    return months <= 0 ? 0 : months;
  }

  const handleOndeleteTenantById = async (id) => {
      const tenantDeletedResponse = await Service.deleteTenant(id);
      const getTenantsReponse = await Service.getTenants();
      setTentants(getTenantsReponse);
      setTentantsWithFilters(getTenantsReponse);
  }

  const addNewTenant = () => {
    const dummyDate = new Date();
    setnewTenant({id: undefined, name:'', paymentStatus:'CURRENT', leaseEndDate: dummyDate.toISOString()});
    //also create a function to show/hidden the tenat form
  }
  const handleOnSubmitForm = async (event) => {
    event.preventDefault();
    const tenantAddedResponse = await Service.addTenant(newTenant);
    const getTenantsReponse = await Service.getTenants();
    setTentants(getTenantsReponse);
    setTentantsWithFilters(getTenantsReponse);
  }

  return (
    loading ? <>Cargando</> :
      <>
        <div className="container">
          <h1>Tenants</h1>
          <ul className="nav nav-tabs">
            <li className="nav-item" onClick={()=>resetFilters()}>
              <a className="nav-link active" href="#">All</a>
            </li>
            <li className="nav-item" onClick={()=>filterByStatus('LATE')}>
              <a className="nav-link" href="#">Payment is late</a>
            </li>
            <li className="nav-item" onClick={()=>filterByLeaseEndDateMonthLessThan(1)}>
              <a className="nav-link" href="#">Lease ends in less than a month</a>
            </li>
          </ul>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Payment Status</th>
                <th>Lease End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {tenantsWithFilters.map(tenant => {
                return <tr>
                        <td>{tenant.id}</td>
                        <td>{tenant.name}</td>
                        <td>{tenant.paymentStatus}</td>
                        <td>{tenant.leaseEndDate}</td>
                        <td>
                          <button className="btn btn-danger" onClick={()=>handleOndeleteTenantById(tenant.id)}>Delete</button>
                        </td>
                       </tr>;
              })}
            </tbody>
          </table>
        </div>
        <div className="container">
          <button className="btn btn-secondary" onClick={()=>addNewTenant()}>Add Tenant</button>
        </div>
        <div className="container">
          <form onSubmit={handleOnSubmitForm}>
            <div className="form-group">
              <label>Name</label>
              <input className="form-control" 
              value={newTenant.name}
              onChange={(e) => setnewTenant({ ...newTenant, name: e.target.value})}/>
            </div>
            <div className="form-group">
              <label>Payment Status</label>
              <select className="form-control"
              value={newTenant.paymentStatus} 
              onChange={(e) => setnewTenant({ ...newTenant, paymentStatus: e.target.paymentStatus})}>
                <option>CURRENT</option>
                <option>LATE</option>
              </select>
            </div>
            <div className="form-group">
              <label>Lease End Date</label>
              <input className="form-control" 
              name="leaseEndDate"
              value={newTenant.leaseEndDate}
              onChange={(e) => setnewTenant({ ...newTenant, name: e.target.leaseEndDate})}/>
            </div>
            <button className="btn btn-primary">Save</button>
            <button className="btn">Cancel</button>
          </form>
        </div>
      </>
  );
}

export default App;
