import React, {useState, useEffect} from 'react';
import { Service } from './Service';

function App() {

  const [tenants, setTentants] = useState([]);
  const [tenantsWithFilters, setTentantsWithFilters] = useState([]);
  const [loading, setLoading] = useState(false);


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
                          <button className="btn btn-danger">Delete</button>
                        </td>
                       </tr>;
              })}
            </tbody>
          </table>
        </div>
        <div className="container">
          <button className="btn btn-secondary">Add Tenant</button>
        </div>
        <div className="container">
          <form>
            <div className="form-group">
              <label>Name</label>
              <input className="form-control"/>
            </div>
            <div className="form-group">
              <label>Payment Status</label>
              <select className="form-control">
                <option>CURRENT</option>
                <option>LATE</option>
              </select>
            </div>
            <div className="form-group">
              <label>Lease End Date</label>
              <input className="form-control"/>
            </div>
            <button className="btn btn-primary">Save</button>
            <button className="btn">Cancel</button>
          </form>
        </div>
      </>
  );
}

export default App;
