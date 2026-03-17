output "instance_public_ip" {
  value       = hcloud_server.labas_smk.ipv4_address
  description = "SSH: ssh root@<this_ip> -i ~/.ssh/labas_key"
}