import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { cn } from "@/utils/classes";

@Component({
  selector: "app-layout",
  imports: [RouterLink, RouterLinkActive],
  templateUrl: "./layout.component.html",
})
export class LayoutComponent {
  protected readonly cn = cn;
}
