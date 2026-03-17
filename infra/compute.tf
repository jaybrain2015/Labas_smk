resource "hcloud_ssh_key" "labas_key" {
  name       = "labas-smk-key"
  public_key = var.ssh_public_key
}

resource "hcloud_server" "labas_smk" {
  name        = "labas-smk"
  image       = "ubuntu-22.04"
  server_type = "cx23"
  location    = "nbg1"
  ssh_keys    = [hcloud_ssh_key.labas_key.id]

  user_data = <<-EOF
    #!/bin/bash
    apt-get update -y
    apt-get install -y curl git

    # Install Docker
    curl -fsSL https://get.docker.com | sh
    usermod -aG docker root
    systemctl enable docker
    systemctl start docker

    # Install k3s
    curl -sfL https://get.k3s.io | sh -
    sleep 30

    # Install ArgoCD
    kubectl create namespace argocd
    kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

    echo "Setup complete!" > /root/setup-done.txt
  EOF
}

resource "hcloud_firewall" "labas_fw" {
  name = "labas-smk-fw"

  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "22"
    source_ips = ["0.0.0.0/0", "::/0"]
  }
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "80"
    source_ips = ["0.0.0.0/0", "::/0"]
  }
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "443"
    source_ips = ["0.0.0.0/0", "::/0"]
  }
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "6443"
    source_ips = ["0.0.0.0/0", "::/0"]
  }
}

resource "hcloud_firewall_attachment" "labas_fw_attach" {
  firewall_id = hcloud_firewall.labas_fw.id
  server_ids  = [hcloud_server.labas_smk.id]
}