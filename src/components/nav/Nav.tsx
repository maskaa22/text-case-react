import { Button } from "@chakra-ui/react";
import './nav.css';

function Nav() {

  return (
    <header className="header">
      <nav className="nav">
        <Button className="login">LOGIN</Button>
      </nav>
    </header>
  );
}
export default Nav;
